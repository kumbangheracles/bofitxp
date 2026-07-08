import request from "supertest";
import { AuthService } from "../services/auth.service";
import app from "../app";
import { Users } from "../generated/prisma/client";

// 1. Perintahkan Jest untuk melakukan mock pada file AuthService
jest.mock("../services/auth.service");

describe("POST /api/auth/login", () => {
  // Ambil referensi class mock agar kita bisa mengatur perilakunya (stubbing)
  const MockedAuthService = AuthService as jest.MockedClass<typeof AuthService>;

  beforeEach(() => {
    // Bersihkan sisa-sisa mock dari test case sebelumnya
    jest.clearAllMocks();
  });

  //   Success Scenario ==========
  test("Harus mengembalikan status 200 dan token jika login sukses", async () => {
    // 2. Skenario Sukses: Paksa fungsi login mengembalikan mock token
    MockedAuthService.prototype.login.mockResolvedValue({
      token: "adkasiodaslkdnasduasdibasdkj",
    });

    // 3. Supertest beraksi mensimulasikan request POST ke Express
    const response = await request(app).post("/api/auth/login").send({
      identifier: "wahyutest",
      password: "Wahyu*123",
    });

    // 4. Jest bertindak sebagai hakim untuk memeriksa hasilnya
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Login success",
      data: "adkasiodaslkdnasduasdibasdkj",
    });
  });
  //   Failed Scenario ==========
  test("Harus mengembalikan status 403 jika user tidak ditemukan atau password salah", async () => {
    // 2. Skenario Gagal: Paksa fungsi login melempar error "User not found"
    MockedAuthService.prototype.login.mockRejectedValue(
      new Error("User not found"),
    );

    // 3. Supertest mengirim request data login yang salah
    const response = await request(app).post("/api/auth/login").send({
      identifier: "user_salah@mail.com",
      password: "passwordAsalAsalan*123",
    });

    // 4. Jest memeriksa apakah respons HTTP berstatus 403 (Forbidden)
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

  //   Success Scenario ==========
  test("Harus mengembalikan status 200 dan mengaktifkan user jika kode valid", async () => {
    // 2. Skenario Sukses: Siapkan data user tiruan yang seolah-olah berhasil di-update
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

    // Paksa fungsi activationCode di service untuk mengembalikan data sukses
    MockedAuthService.prototype.activationCode.mockResolvedValue({
      updatedUser: mockUpdatedUser,
    });

    // 3. Supertest menembak rute aktivasi (sesuaikan URL rute asli Anda)
    const response = await request(app)
      .post("/api/auth/activation")
      .send({ activationCode: "VALID_CODE_123" });

    // 4. Pembuktian (Assertion) sesuai struktur dari helper response.success Anda
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User successfully activated");
    expect(response.body.data).toEqual(mockUpdatedUser);
  });

  //   Failed Scenario ==========
  test("Harus mengembalikan status error jika kode aktivasi tidak ditemukan", async () => {
    // 2. Skenario Gagal: Paksa service melempar error "User not found"
    MockedAuthService.prototype.activationCode.mockRejectedValue(
      new Error("User not found"),
    );

    // 3. Supertest mengirim kode yang salah
    const response = await request(app)
      .post("/api/auth/activation")
      .send({ activationCode: "KODE_SALAH" });

    // 4. Pembuktian untuk skenario gagal (sesuaikan dengan format response.error Anda)
    // Umumnya response.error mengembalikan status 400 atau 404 bergantung pada controller Anda
    expect(response.status).not.toBe(200);
    expect(response.body.message).toBe("User is failed activated");
  });
});
