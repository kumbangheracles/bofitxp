import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "../src/generated/prisma/client";
import { encrypt } from "../src/utils/encryption";

const prisma = new PrismaClient();

async function main() {
  await prisma.users.deleteMany();

  const password = encrypt("password123");

  await prisma.users.createMany({
    data: [
      {
        fullName: "Ahmad Fauzan",
        username: "ahmadf",
        email: "ahmadf@test.com",
        password,
        activationCode: null,
        isVerified: true,
        level: 2,
        streak: 5,
        xp: 250,
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
