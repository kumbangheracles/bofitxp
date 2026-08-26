import request from "supertest";
import { AuthService } from "../services/auth.service";
import app from "../app";
import { Users } from "../generated/prisma/client";

jest.mock("../services/auth.service");

describe("POST /api/auth/login", () => {
  const MockedAuthService = AuthService as jest.MockedClass<typeof AuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Harus mengembalikan status 200 dan token jika login sukses", async () => {
    MockedAuthService.prototype.login.mockResolvedValue({
      token: "adkasiodaslkdnasduasdibasdkj",
    });

    const response = await request(app).post("/api/auth/login").send({
      identifier: "wahyutest",
      password: "Wahyu*123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Login success",
      data: "adkasiodaslkdnasduasdibasdkj",
    });
  });
  test("Harus mengembalikan status 403 jika user tidak ditemukan atau password salah", async () => {
    MockedAuthService.prototype.login.mockRejectedValue(
      new Error("User not found"),
    );

    const response = await request(app).post("/api/auth/login").send({
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
  const MockedAuthService = AuthService as jest.MockedClass<typeof AuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Harus mengembalikan status 200 dan mengaktifkan user jika kode valid", async () => {
    const mockUpdatedUser: Users = {
      id: "1",
      username: "wahyutest",
      email: "wahyu@mail.com",
      isVerified: true,
      activationCode: null,
      avatarUrl: "",
      createdAt: new Date(),
      fullName: "Wahyu bin jamal",
      level: 0,
      password: "Wahyu*123",
      streak: 0,
      updatedAt: new Date(),
      xp: 0,
    };

    MockedAuthService.prototype.activationCode.mockResolvedValue({
      updatedUser: mockUpdatedUser,
    });

    const response = await request(app)
      .post("/api/auth/activation")
      .send({ activationCode: "VALID_CODE_123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User successfully activated");
    expect(response.body.data).toEqual(mockUpdatedUser);
  });

  test("Harus mengembalikan status error jika kode aktivasi tidak ditemukan", async () => {
    MockedAuthService.prototype.activationCode.mockRejectedValue(
      new Error("User not found"),
    );

    const response = await request(app)
      .post("/api/auth/activation")
      .send({ activationCode: "KODE_SALAH" });

    expect(response.status).not.toBe(200);
    expect(response.body.message).toBe("User is failed activated");
  });
});
