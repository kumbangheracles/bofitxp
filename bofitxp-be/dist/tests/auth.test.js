"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = require("../services/auth.service");
const app_1 = __importDefault(require("../app"));
process.env.SECRET = process.env.SECRET ?? "test-secret";
jest.mock("../services/auth.service");
describe("POST /api/auth/login", () => {
    const MockedAuthService = auth_service_1.AuthService;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("Harus mengembalikan status 200 dan token jika login sukses", async () => {
        const validToken = jsonwebtoken_1.default.sign({
            id: "user-1",
            username: "wahyutest",
            email: "wahyutest@mail.com",
            isVerified: true,
            gender: "pria",
            age: 25,
            body_mass_index: 24.2,
            body_weight: 70,
            body_height: 170,
            level: 0,
            streak: 0,
            avatarUrl: "",
            xp: 0,
            target_final: "maintain_fitness",
            createdAt: new Date().toISOString(),
        }, process.env.SECRET, { expiresIn: "1h" });
        MockedAuthService.prototype.login.mockResolvedValue({
            token: validToken,
        });
        const response = await (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({
            identifier: "wahyutest",
            password: "Wahyu*123",
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Login success",
            data: validToken,
        });
    });
    test("Harus mengembalikan status 403 jika user tidak ditemukan atau password salah", async () => {
        MockedAuthService.prototype.login.mockRejectedValue(new Error("User not found"));
        const response = await (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({
            identifier: "user_salah@mail.com",
            password: "passwordAsalAsalan*123",
        });
        expect(response.status).toBe(403);
        expect(response.body).toEqual({
            message: "User not found",
            data: null,
        });
    });
});
describe("POST /api/auth/activation", () => {
    const MockedAuthService = auth_service_1.AuthService;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("Harus mengembalikan status 200 dan mengaktifkan user jika kode valid", async () => {
        const now = new Date().toISOString();
        const mockUpdatedUser = {
            id: "1",
            username: "wahyutest",
            email: "wahyu@mail.com",
            isVerified: true,
            activationCode: null,
            avatarUrl: "",
            createdAt: now,
            fullName: "Wahyu bin jamal",
            level: 0,
            password: "Wahyu*123",
            streak: 0,
            updatedAt: now,
            xp: 0,
            gender: "pria",
            age: 25,
            body_weight: 70,
            body_height: 170,
            body_mass_index: 24.2,
            role: "MEMBER",
            target_final: "maintain_fitness",
            expireAt: null,
        };
        MockedAuthService.prototype.activationCode.mockResolvedValue({
            updatedUser: mockUpdatedUser,
        });
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/activation")
            .send({ activationCode: "VALID_CODE_123" });
        expect(response.status).toBe(200);
        expect(response.body.meta.message).toBe("User successfully activated");
        expect(response.body.data).toEqual(mockUpdatedUser);
    });
    test("Harus mengembalikan status error jika kode aktivasi tidak ditemukan", async () => {
        MockedAuthService.prototype.activationCode.mockRejectedValue(new Error("User not found"));
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/activation")
            .send({ activationCode: "KODE_SALAH" });
        expect(response.status).toBe(500);
        expect(response.body.meta.message).toBe("User is failed activated");
    });
});
