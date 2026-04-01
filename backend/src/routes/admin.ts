import { Router } from "express";
import { z } from "zod";
import { VehicleStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware);

const vehicleCreateSchema = z.object({
  title: z.string().trim().min(2),
  brand: z.string().trim().min(1),
  model: z.string().trim().min(1),
  year: z.coerce.number().int().min(1980).max(2035),
  /** 0 autorisé (prix à préciser / brouillon côté métier) */
  priceXof: z.coerce.number().int().nonnegative(),
  mileageKm: z.coerce.number().int().nonnegative(),
  fuel: z.string().trim().min(1),
  transmission: z.string().trim().min(1),
  description: z.string().trim().min(1),
  images: z.array(z.string().min(1)).default([]),
  status: z.nativeEnum(VehicleStatus).optional(),
});

function imagesToJson(images: string[]): string {
  return JSON.stringify(images);
}

router.get("/vehicles", async (_req, res) => {
  const list = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(
    list.map((v) => ({
      ...v,
      images: JSON.parse(v.images || "[]") as string[],
    }))
  );
});

router.post("/vehicles", async (req, res) => {
  const parsed = vehicleCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const firstField = Object.entries(flat.fieldErrors).find(
      ([, msgs]) => msgs && msgs.length
    );
    const hint = firstField
      ? ` — ${firstField[0]} : ${firstField[1]?.[0] ?? ""}`
      : flat.formErrors[0]
        ? ` — ${flat.formErrors[0]}`
        : "";
    return res.status(400).json({
      error: `Données invalides${hint}`,
      details: flat,
    });
  }
  const d = parsed.data;
  const v = await prisma.vehicle.create({
    data: {
      title: d.title,
      brand: d.brand,
      model: d.model,
      year: d.year,
      priceXof: d.priceXof,
      mileageKm: d.mileageKm,
      fuel: d.fuel,
      transmission: d.transmission,
      description: d.description,
      images: imagesToJson(d.images),
      status: d.status ?? VehicleStatus.DRAFT,
    },
  });
  return res.status(201).json({ ...v, images: d.images });
});

router.patch("/vehicles/:id", async (req, res) => {
  const partial = vehicleCreateSchema.partial().safeParse(req.body);
  if (!partial.success) {
    const flat = partial.error.flatten();
    const firstField = Object.entries(flat.fieldErrors).find(
      ([, msgs]) => msgs && msgs.length
    );
    const hint = firstField
      ? ` — ${firstField[0]} : ${firstField[1]?.[0] ?? ""}`
      : "";
    return res.status(400).json({ error: `Données invalides${hint}`, details: flat });
  }
  const d = partial.data;
  const existing = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    return res.status(404).json({ error: "Introuvable" });
  }
  const images =
    d.images !== undefined ? imagesToJson(d.images) : undefined;
  const v = await prisma.vehicle.update({
    where: { id: req.params.id },
    data: {
      ...(d.title !== undefined && { title: d.title }),
      ...(d.brand !== undefined && { brand: d.brand }),
      ...(d.model !== undefined && { model: d.model }),
      ...(d.year !== undefined && { year: d.year }),
      ...(d.priceXof !== undefined && { priceXof: d.priceXof }),
      ...(d.mileageKm !== undefined && { mileageKm: d.mileageKm }),
      ...(d.fuel !== undefined && { fuel: d.fuel }),
      ...(d.transmission !== undefined && { transmission: d.transmission }),
      ...(d.description !== undefined && { description: d.description }),
      ...(images !== undefined && { images }),
      ...(d.status !== undefined && { status: d.status }),
    },
  });
  return res.json({
    ...v,
    images: JSON.parse(v.images || "[]") as string[],
  });
});

router.delete("/vehicles/:id", async (req, res) => {
  try {
    await prisma.vehicle.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch {
    return res.status(404).json({ error: "Introuvable" });
  }
});

router.get("/inquiries", async (_req, res) => {
  const list = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { vehicle: { select: { title: true, id: true } } },
  });
  return res.json(list);
});

export default router;
