import exporess from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import userController from "../controllers/user.controller";
import userQuestController from "../controllers/userQuest.controller";
const router = exporess.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/activation", authController.activation);
router.post("/auth/resend-activation", authController.resendActivationCode);
router.get("/auth/me", authMiddleware, authController.me);

// User
router.patch("/user-update", authMiddleware, userController.updateUser);

// Quests
router.post(
  "/user-quests/generate",
  authMiddleware,
  userQuestController.generateQuests,
);
router.get("/user-quests", authMiddleware, userQuestController.getAll);
router.patch(
  "/user-quests/:userQuestId/:questId",
  authMiddleware,
  userQuestController.finishedQuest,
);
// Mahasiswa

// router.post("/mahasiswa", mahasiswaController.createMahasiswa);
// router.get("/mahasiswa", mahasiswaController.getAllMahasiswa);

export default router;
