import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { sendInquiryNotification } from "../lib/mail.js";

const router = Router();

const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(5),
  vehicleId: z.string().optional(),
});

router.post("/", async (req, res) => {
  const parsed = inquirySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Veuillez compléter tous les champs requis." });
  }
  const { name, email, phone, message, vehicleId } = parsed.data;
  let vehicleTitle: string | null = null;
  if (vehicleId) {
    const v = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!v) {
      return res.status(400).json({ error: "Véhicule invalide" });
    }
    vehicleTitle = v.title;
  }
  await prisma.inquiry.create({
    data: {
      name,
      email,
      phone: phone || null,
      message,
      vehicleId: vehicleId || null,
    },
  });

  const mail = await sendInquiryNotification({
    name,
    email,
    phone: phone || null,
    message,
    vehicleTitle,
  });
  if (!mail.sent && process.env.SMTP_HOST) {
    console.warn(
      "[inquiries] Demande enregistrée mais e-mail non envoyé:",
      mail.error ?? "voir logs"
    );
  }

  return res.status(201).json({ ok: true });
});

export default router;
