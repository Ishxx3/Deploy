import { Router } from "express";
import { z } from "zod";
import { VehicleStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const router = Router();

function parseImages(images: string): string[] {
  try {
    const arr = JSON.parse(images) as unknown;
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

router.get("/", async (req, res) => {
  const status = (req.query.status as string) || "PUBLISHED";
  const allowed = ["PUBLISHED", "SOLD"] as const;
  const s = allowed.includes(status as (typeof allowed)[number])
    ? (status as VehicleStatus)
    : VehicleStatus.PUBLISHED;

  const list = await prisma.vehicle.findMany({
    where: { status: s },
    orderBy: { createdAt: "desc" },
  });
  return res.json(
    list.map((v) => ({
      ...v,
      images: parseImages(v.images),
    }))
  );
});

router.get("/:id", async (req, res) => {
  const v = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
  if (!v || (v.status !== "PUBLISHED" && v.status !== "SOLD")) {
    return res.status(404).json({ error: "Véhicule introuvable" });
  }
  return res.json({ ...v, images: parseImages(v.images) });
});

export default router;
