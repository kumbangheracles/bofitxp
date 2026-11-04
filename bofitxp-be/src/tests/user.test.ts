import request from "supertest";
import app from "../app";
import { UserService } from "../services/user.service";
import { renderMailHtml, sendMail } from "../services/mailer.service";
import { generateToken } from "../utils/jwt";
import prisma from "../utils/prisma";
import { encrypt } from "../utils/encryption";

jest.mock("../services/mailer.service", () => ({
  renderMailHtml: jest.fn().mockResolvedValue("<p>otp</p>"),
  sendMail: jest.fn().mockResolvedValue({}),
}));

jest.mock("../services/user.service");
const RealUserService = jest.requireActual(
  "../services/user.service",
).UserService;
jest.mock("../utils/prisma", () => ({
  __esModule: true,
  default: {
    users: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("PATCH /api/user-update", () => {
  const MockedUserService = UserService as jest.MockedClass<typeof UserService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Harus mengembalikan token baru setelah update profil agar data tidak revert saat refresh", async () => {
    const oldToken = generateToken({
      id: "user-1",
      fullName: "Old Name",
      username: "olduser",
      email: "olduser@example.com",
      isVerified: true,
      gender: "pria",
      age: 25,
      body_mass_index: 24.0,
      body_weight: 70,
      body_height: 170,
      level: 2,
      streak: 5,
      avatarUrl: "https://example.com/avatar.png",
      xp: 100,
      target_final: "maintain_fitness",
      createdAt: new Date(),
    });

    const updatedUser = {
      id: "user-1",
      fullName: "New Name",
      username: "olduser",
      email: "olduser@example.com",
      isVerified: true,
      gender: "wanita",
      age: 27,
      body_mass_index: 22.9,
      body_weight: 65,
      body_height: 168,
      level: 2,
      streak: 5,
      avatarUrl: "https://example.com/avatar.png",
      xp: 100,
      target_final: "weight_loss",
      createdAt: new Date(),
      updatedAt: new Date(),
      password: "hashed",
      activationCode: null,
      role: "MEMBER",
      expireAt: null,
    } as any;

    MockedUserService.prototype.update.mockResolvedValue({ updatedUser });

    const response = await request(app)
      .patch("/api/user-update")
      .set("Authorization", `Bearer ${oldToken}`)
      .send({ fullName: "New Name", gender: "wanita", age: 27 });

    expect(response.status).toBe(200);
    expect(response.body.meta.message).toBe("Success update user");
    expect(response.body.data).toMatchObject({
      updatedUser: expect.objectContaining({
        fullName: "New Name",
        gender: "wanita",
      }),
      token: expect.any(String),
    });
    expect(response.body.data.token).not.toBe(oldToken);
    expect(response.body.data.updatedUser.fullName).toBe("New Name");
  });

  test("UserService.update harus menolak password baru jika currentPassword salah", async () => {
    const service = new RealUserService();
    const user = {
      id: "user-1",
      fullName: "Tester",
      username: "tester",
      email: "tester@example.com",
      password: encrypt("old-password"),
      isVerified: true,
      gender: "pria",
      age: 25,
      level: 1,
      streak: 0,
      xp: 0,
      avatarUrl: null,
      target_final: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    (prisma.users.findUnique as jest.Mock).mockResolvedValue(user);

    await expect(
      service.update(
        {
          password: "new-password-123",
          currentPassword: "wrong-password",
          confirmPassword: "new-password-123",
        },
        "user-1",
      ),
    ).rejects.toThrow("Current password is invalid");

    expect(prisma.users.update).not.toHaveBeenCalled();
  });

  test("UserService.update harus hash password baru dan mengubah email ke status belum terverifikasi", async () => {
    const service = new RealUserService();
    const user = {
      id: "user-1",
      fullName: "Tester",
      username: "tester",
      email: "tester@example.com",
      password: encrypt("old-password"),
      isVerified: true,
      gender: "pria",
      age: 25,
      level: 1,
      streak: 0,
      xp: 0,
      avatarUrl: null,
      target_final: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    const updatedUser = {
      ...user,
      email: "new-email@example.com",
      isVerified: false,
      password: encrypt("new-password-123"),
    };

    (prisma.users.findUnique as jest.Mock)
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(null);
    (prisma.users.update as jest.Mock).mockResolvedValue(updatedUser);

    const result = await service.update(
      {
        email: "new-email@example.com",
        password: "new-password-123",
        currentPassword: "old-password",
        confirmPassword: "new-password-123",
      },
      "user-1",
    );

    expect(prisma.users.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-1" },
        data: expect.objectContaining({
          email: "new-email@example.com",
          isVerified: false,
          password: expect.any(String),
        }),
      }),
    );
    expect(result.updatedUser.email).toBe("new-email@example.com");
    expect(result.updatedUser.password).not.toBe("new-password-123");
  });

  test("UserService.requestEmailChange harus mengirim kode OTP ke email baru", async () => {
    const service = new RealUserService();
    const user = {
      id: "user-1",
      fullName: "Tester",
      username: "tester",
      email: "old@example.com",
      password: encrypt("old-password"),
      isVerified: true,
      otpConfirmationCode: null,
      otpConfirmationExpireAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    (prisma.users.findUnique as jest.Mock)
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(null);
    (prisma.users.update as jest.Mock).mockResolvedValue({
      ...user,
      otpConfirmationCode: "123456",
    });

    const result = await service.requestEmailChange(
      "user-1",
      "new@example.com",
    );

    expect(prisma.users.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-1" },
        data: expect.objectContaining({
          otpConfirmationCode: expect.any(String),
          otpConfirmationExpireAt: expect.any(Date),
        }),
      }),
    );
    expect(renderMailHtml).toHaveBeenCalledWith(
      "confirmation-email.ejs",
      expect.objectContaining({
        email: "new@example.com",
        otpConfirmationCode: expect.any(String),
      }),
    );
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "new@example.com",
        subject: expect.any(String),
        html: expect.any(String),
      }),
    );
    expect(result.pendingEmail).toBe("new@example.com");
  });

  test("UserService.confirmEmailChange harus memperbarui email setelah OTP valid", async () => {
    const service = new RealUserService();
    const user = {
      id: "user-1",
      fullName: "Tester",
      username: "tester",
      email: "old@example.com",
      password: encrypt("old-password"),
      isVerified: true,
      otpConfirmationCode: "123456",
      otpConfirmationExpireAt: new Date(Date.now() + 600000),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    (prisma.users.findUnique as jest.Mock).mockResolvedValue(user);
    (prisma.users.update as jest.Mock).mockResolvedValue({
      ...user,
      email: "new@example.com",
      isVerified: false,
      otpConfirmationCode: null,
      otpConfirmationExpireAt: null,
    });

    const result = await service.confirmEmailChange(
      "user-1",
      "new@example.com",
      "123456",
    );

    expect(prisma.users.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-1" },
        data: expect.objectContaining({
          email: "new@example.com",
          isVerified: false,
          otpConfirmationCode: null,
        }),
      }),
    );
    expect(result.updatedUser.email).toBe("new@example.com");
  });
});
