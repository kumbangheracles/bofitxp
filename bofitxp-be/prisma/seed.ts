import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "../src/generated/prisma/client";
import { encrypt } from "../src/utils/encryption";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.userQuest.deleteMany(),
    prisma.users.deleteMany(),
  ]);
  const password = encrypt("password123");

  await prisma.users.createMany({
    data: [
      {
        fullName: "Ahmad Herkal",
        username: "herkaltest",
        email: "herkal@raharja.info",
        password,
        activationCode: null,
        isVerified: true,
        level: 2,
        streak: 5,
        xp: 250,
        gender: "pria",
      },
      {
        fullName: "Ahmad Fauzan",
        username: "ahmadf",
        email: "fauzancool2026@yopmail.com",
        password,
        activationCode: null,
        isVerified: true,
        level: 2,
        streak: 5,
        xp: 250,
        gender: "pria",
      },
      {
        fullName: "Siti Nurhaliza",
        username: "sitin",
        email: "sitin@test.com",
        password,
        activationCode: null,
        isVerified: true,
        level: 3,
        streak: 10,
        xp: 520,
        gender: "pria",
      },
      {
        fullName: "Budi Santoso",
        username: "budis",
        email: "budis@test.com",
        password,
        activationCode: null,
        isVerified: true,
        level: 1,
        streak: 2,
        xp: 100,
        gender: "pria",
      },
      {
        fullName: "Rina Marlina",
        username: "rinar",
        email: "rina@test.com",
        password,
        activationCode: null,
        isVerified: true,
        level: 4,
        streak: 18,
        xp: 860,
        expireAt: null,
        gender: "pria",
      },
      {
        fullName: "Dedi Kurniawan",
        username: "dedik",
        email: "dedi@test.com",
        password,
        activationCode: null,
        isVerified: false,
        level: 0,
        streak: 0,
        xp: 0,
        expireAt: null,
        gender: "pria",
      },
      {
        fullName: "Maya Putri",
        username: "mayap",
        email: "maya@test.com",
        password,
        activationCode: "123456",
        isVerified: false,
        level: 0,
        streak: 0,
        expireAt: null,
        xp: 0,
        gender: "pria",
      },
      {
        fullName: "Andi Wijaya",
        username: "andiw",
        email: "andi@test.com",
        password,
        activationCode: null,
        isVerified: true,
        level: 5,
        streak: 22,
        expireAt: null,
        xp: 1250,
        gender: "pria",
      },
      {
        fullName: "Fajar Ramadhan",
        username: "fajarr",
        email: "fajar@test.com",
        password,
        activationCode: null,
        isVerified: true,
        level: 2,
        streak: 6,
        expireAt: null,
        xp: 340,
        gender: "pria",
      },
      {
        fullName: "Nabila Azzahra",
        username: "nabilaa",
        email: "nabila@test.com",
        password,
        activationCode: null,
        isVerified: true,
        level: 6,
        streak: 30,
        expireAt: null,
        xp: 1800,
        gender: "pria",
      },
      {
        fullName: "Yoga Pratama",
        username: "yogap",
        email: "yoga@test.com",
        password,
        activationCode: null,
        isVerified: true,
        level: 3,
        streak: 11,
        expireAt: null,
        xp: 650,
        gender: "pria",
      },
    ],
  });

  console.log("✅ Seeder Users berhasil dijalankan!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
