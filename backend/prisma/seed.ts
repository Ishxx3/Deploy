import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, VehicleStatus } from "@prisma/client";

const prisma = new PrismaClient();

const demoImages = [
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
];

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@raa.bj";
  const password = process.env.ADMIN_PASSWORD || "raa-admin-2026";
  const hash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash: hash },
    update: { passwordHash: hash },
  });
  console.log(`Admin: ${email} / ${password}`);

  const count = await prisma.vehicle.count();
  if (count === 0) {
    await prisma.vehicle.createMany({
      data: [
        {
          title: "Toyota Corolla — révisée",
          brand: "Toyota",
          model: "Corolla",
          year: 2014,
          priceXof: 4_500_000,
          mileageKm: 125000,
          fuel: "Essence",
          transmission: "Manuelle",
          description:
            "Véhicule récupéré et entièrement réhabilité par nos partenaires mécaniciens. Contrôle technique à jour, historique d’entretien disponible.",
          images: JSON.stringify(demoImages),
          status: VehicleStatus.PUBLISHED,
        },
        {
          title: "Peugeot 207 — occasion contrôlée",
          brand: "Peugeot",
          model: "207",
          year: 2010,
          priceXof: 2_200_000,
          mileageKm: 178000,
          fuel: "Essence",
          transmission: "Manuelle",
          description:
            "Idéal pour la ville. Réparations mécaniques effectuées, carrosserie légèrement patinée. Prix accessible.",
          images: JSON.stringify([demoImages[0]]),
          status: VehicleStatus.PUBLISHED,
        },
      ],
    });
    console.log("Véhicules de démonstration créés.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
