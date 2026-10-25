process.env.OTP_RATE_LIMIT_SECRET =
  process.env.OTP_RATE_LIMIT_SECRET || "test-otp-secret";

const {
  hashEmailForRedis,
  normalizeEmail,
  getClientIp,
  OTP_SECURITY_CONFIG,
} = require("../utils/otpGuard");

describe("OTP guard utilities", () => {
  test("email is normalized consistently before hashing and storage", () => {
    expect(normalizeEmail("  User.Name+tag@Example.COM ")).toBe(
      "user.name+tag@example.com",
    );
    expect(hashEmailForRedis("  User.Name+tag@Example.COM ")).toBe(
      hashEmailForRedis("user.name+tag@example.com"),
    );
  });

  test("client IP is derived from the trusted forward chain", () => {
    const req = {
      headers: {
        "x-forwarded-for": "203.0.113.7, 10.0.0.2",
      },
      socket: { remoteAddress: "127.0.0.1" },
    } as any;

    expect(getClientIp(req)).toBe("203.0.113.7");
  });

  test("security configuration keeps OTP limits centralized", () => {
    expect(OTP_SECURITY_CONFIG.ipMaxRequests).toBe(5);
    expect(OTP_SECURITY_CONFIG.emailCooldownMs).toBe(60000);
    expect(OTP_SECURITY_CONFIG.dailyMaxRequests).toBe(10);
  });
});
