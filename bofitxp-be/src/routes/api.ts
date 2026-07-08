import exporess from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import userController from "../controllers/user.controller";
const router = exporess.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/activation", authController.activation);
router.get("/auth/me", authMiddleware, authController.me);

// User
router.patch("/user/:id", authMiddleware, userController.updateUser);

// Mahasiswa

// router.post("/mahasiswa", mahasiswaController.createMahasiswa);
// router.get("/mahasiswa", mahasiswaController.getAllMahasiswa);

export default router;
