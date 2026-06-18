import * as dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "../src/generated/prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Hapus data lama (opsional)
  await prisma.mahasiswa.deleteMany();

  // Insert data
  await prisma.mahasiswa.createMany({
    data: [
      {
        fullName: "Budi Santoso",
        nim: "2021001",
        jurusan: "Teknik Informatika",
        email: "budi@test.com",
        noHp: "08912313123",
      },
      {
        fullName: "Siti Rahma",
        nim: "2021002",
        jurusan: "Sistem Informasi",
        email: "sitirahma@test.com",
        noHp: "0809123123",
      },
      {
        fullName: "Andi Wijaya",
        nim: "2021003",
        jurusan: "Teknik Informatika",
        email: "andiawi@test.com",
        noHp: "080912312123",
      },
    ],
  });

  console.log(" Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(" Seeding gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
