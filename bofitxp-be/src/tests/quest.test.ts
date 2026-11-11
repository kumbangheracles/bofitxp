process.env.GROQ_API_KEY = process.env.GROQ_API_KEY ?? "test-key";

import { UserQuestService } from "../services/userQuest.service";

describe("UserQuestService streak and challenge evaluation", () => {
  test("mengembalikan konfigurasi Groq yang aman ketika API key tidak tersedia", async () => {
    const previousKey = process.env.GROQ_API_KEY;
    delete process.env.GROQ_API_KEY;
    jest.resetModules();

    const { getGroqClient } = await import("../utils/groq");
    expect(getGroqClient()).toBeNull();

    if (previousKey) {
      process.env.GROQ_API_KEY = previousKey;
    }
  });

  test("mengaktifkan combo x2 setelah 3 quest daily berturut-turut", () => {
    const service = new UserQuestService();

    const result = service.resolveQuestEvent({
      userLevel: 2,
      recentCompletedCount: 3,
      questDifficulty: "easy",
      questCategory: "daily",
      lastQuestCompletedAt: new Date(Date.now() - 1000 * 60 * 60),
    });

    expect(result.streak.triggered).toBe(true);
    expect(result.streak.multiplier).toBe(2);
    expect(result.toast?.title).toBe("🔥 Combo Streak x2");
  });

  test("mengaktifkan challenge x3 untuk special atau quest hard di atas kemampuan user", () => {
    const service = new UserQuestService();

    const result = service.resolveQuestEvent({
      userLevel: 1,
      recentCompletedCount: 1,
      questDifficulty: "hard",
      questCategory: "special",
      lastQuestCompletedAt: new Date(Date.now() - 1000 * 60 * 30),
    });

    expect(result.challenge.triggered).toBe(true);
    expect(result.challenge.multiplier).toBe(3);
    expect(result.toast?.title).toBe("⚡ Challenge Boost x3");
  });

  test("harus merefresh daily quest saat hari baru dimulai", () => {
    const service = new UserQuestService();
    const now = new Date("2026-11-10T09:00:00.000Z");

    const result = service.shouldRegenerateQuestCategory(
      [
        {
          createdAt: new Date("2026-11-09T08:00:00.000Z"),
        },
      ] as any,
      "daily",
      now,
    );

    expect(result).toBe(true);
  });

  test("harus merefresh weekly quest saat minggu baru dimulai", () => {
    const service = new UserQuestService();
    const now = new Date("2026-11-10T09:00:00.000Z");

    const result = service.shouldRegenerateQuestCategory(
      [
        {
          createdAt: new Date("2026-11-02T10:00:00.000Z"),
        },
      ] as any,
      "weekly",
      now,
    );

    expect(result).toBe(true);
  });
});
