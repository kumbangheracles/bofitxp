import request from "supertest";
import app from "../app";
import { UserService } from "../services/user.service";
import { generateToken } from "../utils/jwt";

jest.mock("../services/user.service");

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
});
