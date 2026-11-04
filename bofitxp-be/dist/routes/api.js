"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const otpRateLimit_middleware_1 = __importDefault(require("../middlewares/otpRateLimit.middleware"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const userQuest_controller_1 = __importDefault(require("../controllers/userQuest.controller"));
const router = express_1.default.Router();
/**
 * #swagger.tags = ['Auth']
 * #swagger.summary = 'Register user baru'
 * #swagger.description = 'Membuat akun baru.'
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/RegisterRequest' } }
 * #swagger.responses[200] = { description: 'Registrasi berhasil' }
 * #swagger.responses[400] = { description: 'Registrasi gagal' }
 */
router.post("/auth/register", auth_controller_1.default.register);
/**
 * #swagger.tags = ['Auth']
 * #swagger.summary = 'Login user'
 * #swagger.description = 'Login dengan email dan password untuk mendapatkan token JWT.'
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/LoginRequest' } }
 * #swagger.responses[200] = { description: 'Login berhasil' }
 * #swagger.responses[403] = { description: 'User tidak ditemukan / password salah' }
 */
router.post("/auth/login", auth_controller_1.default.login);
/**
 * #swagger.tags = ['Auth']
 * #swagger.summary = 'Aktivasi akun'
 * #swagger.description = 'Verifikasi akun menggunakan kode aktivasi.'
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/ActivationRequest' } }
 * #swagger.responses[200] = { description: 'Akun berhasil diaktifkan' }
 * #swagger.responses[400] = { description: 'Kode aktivasi tidak valid' }
 */
router.post("/auth/activation", auth_controller_1.default.activation);
/**
 * #swagger.tags = ['Auth']
 * #swagger.summary = 'Kirim ulang kode aktivasi'
 * #swagger.description = 'Mengirim ulang kode aktivasi ke email pengguna.'
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/ResendActivationRequest' } }
 * #swagger.responses[200] = { description: 'Kode aktivasi berhasil dikirim' }
 */
router.post("/auth/resend-activation", auth_controller_1.default.resendActivationCode);
/**
 * #swagger.tags = ['Auth']
 * #swagger.summary = 'Ambil profil user'
 * #swagger.description = 'Mengambil data user yang sedang login.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.responses[200] = { description: 'Profil berhasil diambil' }
 * #swagger.responses[404] = { description: 'User belum aktif' }
 */
router.get("/auth/me", auth_middleware_1.default, auth_controller_1.default.me);
// User
/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Kirim OTP konfirmasi'
 * #swagger.description = 'Mengirimkan kode OTP ke email untuk konfirmasi data user.'
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/OtpRequest' } }
 * #swagger.responses[200] = { description: 'OTP berhasil dikirim' }
 */
router.post("/user/send-otp-confirmation-code", otpRateLimit_middleware_1.default, user_controller_1.default.sendOtpConfirmationCode);
/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Kirim ulang OTP konfirmasi'
 * #swagger.description = 'Mengirim ulang OTP konfirmasi ke email user.'
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/OtpRequest' } }
 * #swagger.responses[200] = { description: 'OTP berhasil dikirim ulang' }
 */
router.post("/user/resend-otp-confirmation-code", otpRateLimit_middleware_1.default, user_controller_1.default.resendOtpConfirmationCode);
/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Minta perubahan email'
 * #swagger.description = 'Meminta kode OTP untuk mengganti email user.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/EmailChangeRequest' } }
 * #swagger.responses[200] = { description: 'Permintaan perubahan email berhasil dibuat' }
 */
router.post("/user/request-email-change", auth_middleware_1.default, user_controller_1.default.requestEmailChange);
/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Konfirmasi perubahan email'
 * #swagger.description = 'Mengonfirmasi perubahan email dengan OTP.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/ConfirmEmailChangeRequest' } }
 * #swagger.responses[200] = { description: 'Perubahan email berhasil dikonfirmasi' }
 */
router.post("/user/confirm-email-change", auth_middleware_1.default, user_controller_1.default.confirmEmailChange);
/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Ubah password'
 * #swagger.description = 'Mengubah password user yang sedang login.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/ChangePasswordRequest' } }
 * #swagger.responses[200] = { description: 'Password berhasil diperbarui' }
 */
router.patch("/user/change-password", auth_middleware_1.default, user_controller_1.default.changePassword);
/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Update profil user'
 * #swagger.description = 'Memperbarui profil user yang sedang login.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/UserUpdateRequest' } }
 * #swagger.responses[200] = { description: 'Profil berhasil diperbarui' }
 */
router.patch("/user-update", auth_middleware_1.default, user_controller_1.default.updateUser);
// Quests
/**
 * #swagger.tags = ['User Quests']
 * #swagger.summary = 'Generate quest'
 * #swagger.description = 'Membuat quest berdasarkan kategori daily, weekly, atau special.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.parameters = [{ name: 'quest_category', in: 'query', required: false, schema: { type: 'string', enum: ['daily', 'weekly', 'special'] } }, { name: 'total', in: 'query', required: false, schema: { type: 'integer' } }]
 * #swagger.responses[200] = { description: 'Quest berhasil dibuat' }
 */
router.post("/user-quests/generate", auth_middleware_1.default, userQuest_controller_1.default.generateQuests);
/**
 * #swagger.tags = ['User Quests']
 * #swagger.summary = 'Ambil semua quest user'
 * #swagger.description = 'Menampilkan daftar quest user sesuai kategori.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.parameters = [{ name: 'quest_category', in: 'query', required: false, schema: { type: 'string', enum: ['daily', 'weekly', 'special'] } }]
 * #swagger.responses[200] = { description: 'Daftar quest berhasil diambil' }
 */
router.get("/user-quests", auth_middleware_1.default, userQuest_controller_1.default.getAll);
/**
 * #swagger.tags = ['User Quests']
 * #swagger.summary = 'Selesaikan quest'
 * #swagger.description = 'Menandai quest tertentu sebagai selesai.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.parameters = [{ name: 'userQuestId', in: 'path', required: true, schema: { type: 'string' } }, { name: 'questId', in: 'path', required: true, schema: { type: 'string' } }]
 * #swagger.responses[200] = { description: 'Quest berhasil diselesaikan' }
 */
router.patch("/user-quests/:userQuestId/:questId", auth_middleware_1.default, userQuest_controller_1.default.finishedQuest);
// Mahasiswa
// router.post("/mahasiswa", mahasiswaController.createMahasiswa);
// router.get("/mahasiswa", mahasiswaController.getAllMahasiswa);
exports.default = router;
