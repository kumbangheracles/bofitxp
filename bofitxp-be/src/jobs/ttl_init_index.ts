import prisma from "../utils/prisma";

export class JobService {
  async setupTTLIndex() {
    try {
      // Jalankan perintah raw MongoDB untuk membuat index TTL pada tabel User
      await prisma.$runCommandRaw({
        createIndexes: "Users",
        indexes: [
          {
            key: { expireAt: 1 },
            name: "expireAt_TTL_Index",
            expireAfterSeconds: 0, // Hapus tepat ketika menyentuh waktu di expireAt
          },
        ],
      });
      console.log("MongoDB TTL Index berhasil dikonfigurasi lewat Prisma.");
    } catch (error) {
      console.error("Gagal membuat TTL Index:", error);
    }
  }
}
