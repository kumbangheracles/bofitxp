import exporess from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import otpIpRateLimitMiddleware from "../middlewares/otpRateLimit.middleware";
import userController from "../controllers/user.controller";
import userQuestController from "../controllers/userQuest.controller";
const router = exporess.Router();

/**
 * #swagger.tags = ['Auth']
 * #swagger.summary = 'Register user baru'
 * #swagger.description = 'Membuat akun baru.'
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/RegisterRequest' } }
 * #swagger.responses[200] = { description: 'Registrasi berhasil' }
 * #swagger.responses[400] = { description: 'Registrasi gagal' }
 */
router.post("/auth/register", authController.register);

/**
 * #swagger.tags = ['Auth']
 * #swagger.summary = 'Login user'
 * #swagger.description = 'Login dengan email dan password untuk mendapatkan token JWT.'
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/LoginRequest' } }
 * #swagger.responses[200] = { description: 'Login berhasil' }
 * #swagger.responses[403] = { description: 'User tidak ditemukan / password salah' }
 */
router.post("/auth/login", authController.login);

/**
 * #swagger.tags = ['Auth']
 * #swagger.summary = 'Aktivasi akun'
 * #swagger.description = 'Verifikasi akun menggunakan kode aktivasi.'
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/ActivationRequest' } }
 * #swagger.responses[200] = { description: 'Akun berhasil diaktifkan' }
 * #swagger.responses[400] = { description: 'Kode aktivasi tidak valid' }
 */
router.post("/auth/activation", authController.activation);

/**
 * #swagger.tags = ['Auth']
 * #swagger.summary = 'Kirim ulang kode aktivasi'
 * #swagger.description = 'Mengirim ulang kode aktivasi ke email pengguna.'
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/ResendActivationRequest' } }
 * #swagger.responses[200] = { description: 'Kode aktivasi berhasil dikirim' }
 */
router.post("/auth/resend-activation", authController.resendActivationCode);

/**
 * #swagger.tags = ['Auth']
 * #swagger.summary = 'Ambil profil user'
 * #swagger.description = 'Mengambil data user yang sedang login.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.responses[200] = { description: 'Profil berhasil diambil' }
 * #swagger.responses[404] = { description: 'User belum aktif' }
 */
router.get("/auth/me", authMiddleware, authController.me);

// User
/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Kirim OTP konfirmasi'
 * #swagger.description = 'Mengirimkan kode OTP ke email untuk konfirmasi data user.'
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/OtpRequest' } }
 * #swagger.responses[200] = { description: 'OTP berhasil dikirim' }
 */
router.post(
  "/user/send-otp-confirmation-code",
  otpIpRateLimitMiddleware,
  userController.sendOtpConfirmationCode,
);

/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Kirim ulang OTP konfirmasi'
 * #swagger.description = 'Mengirim ulang OTP konfirmasi ke email user.'
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/OtpRequest' } }
 * #swagger.responses[200] = { description: 'OTP berhasil dikirim ulang' }
 */
router.post(
  "/user/resend-otp-confirmation-code",
  otpIpRateLimitMiddleware,
  userController.resendOtpConfirmationCode,
);

/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Minta perubahan email'
 * #swagger.description = 'Meminta kode OTP untuk mengganti email user.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/EmailChangeRequest' } }
 * #swagger.responses[200] = { description: 'Permintaan perubahan email berhasil dibuat' }
 */
router.post(
  "/user/request-email-change",
  authMiddleware,
  userController.requestEmailChange,
);

/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Konfirmasi perubahan email'
 * #swagger.description = 'Mengonfirmasi perubahan email dengan OTP.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/ConfirmEmailChangeRequest' } }
 * #swagger.responses[200] = { description: 'Perubahan email berhasil dikonfirmasi' }
 */
router.post(
  "/user/confirm-email-change",
  authMiddleware,
  userController.confirmEmailChange,
);

/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Ubah password'
 * #swagger.description = 'Mengubah password user yang sedang login.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/ChangePasswordRequest' } }
 * #swagger.responses[200] = { description: 'Password berhasil diperbarui' }
 */
router.patch(
  "/user/change-password",
  authMiddleware,
  userController.changePassword,
);

/**
 * #swagger.tags = ['User']
 * #swagger.summary = 'Update profil user'
 * #swagger.description = 'Memperbarui profil user yang sedang login.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.requestBody = { required: true, schema: { $ref: '#/components/schemas/UserUpdateRequest' } }
 * #swagger.responses[200] = { description: 'Profil berhasil diperbarui' }
 */
router.patch("/user-update", authMiddleware, userController.updateUser);

// Quests
/**
 * #swagger.tags = ['User Quests']
 * #swagger.summary = 'Generate quest'
 * #swagger.description = 'Membuat quest berdasarkan kategori daily, weekly, atau special.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.parameters = [{ name: 'quest_category', in: 'query', required: false, schema: { type: 'string', enum: ['daily', 'weekly', 'special'] } }, { name: 'total', in: 'query', required: false, schema: { type: 'integer' } }]
 * #swagger.responses[200] = { description: 'Quest berhasil dibuat' }
 */
router.post(
  "/user-quests/generate",
  authMiddleware,
  userQuestController.generateQuests,
);

/**
 * #swagger.tags = ['User Quests']
 * #swagger.summary = 'Ambil semua quest user'
 * #swagger.description = 'Menampilkan daftar quest user sesuai kategori.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.parameters = [{ name: 'quest_category', in: 'query', required: false, schema: { type: 'string', enum: ['daily', 'weekly', 'special'] } }]
 * #swagger.responses[200] = { description: 'Daftar quest berhasil diambil' }
 */
router.get("/user-quests", authMiddleware, userQuestController.getAll);

/**
 * #swagger.tags = ['User Quests']
 * #swagger.summary = 'Selesaikan quest'
 * #swagger.description = 'Menandai quest tertentu sebagai selesai.'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.parameters = [{ name: 'userQuestId', in: 'path', required: true, schema: { type: 'string' } }, { name: 'questId', in: 'path', required: true, schema: { type: 'string' } }]
 * #swagger.responses[200] = { description: 'Quest berhasil diselesaikan' }
 */
router.patch(
  "/user-quests/:userQuestId/:questId",
  authMiddleware,
  userQuestController.finishedQuest,
);
// Mahasiswa

// router.post("/mahasiswa", mahasiswaController.createMahasiswa);
// router.get("/mahasiswa", mahasiswaController.getAllMahasiswa);

export default router;
