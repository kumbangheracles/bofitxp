"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
class JobService {
    async setupTTLIndex() {
        try {
            // Jalankan perintah raw MongoDB untuk membuat index TTL pada tabel User
            await prisma_1.default.$runCommandRaw({
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
        }
        catch (error) {
            console.error("Gagal membuat TTL Index:", error);
        }
    }
}
exports.JobService = JobService;
