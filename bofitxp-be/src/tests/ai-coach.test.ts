import { AiCoachService } from "../services/aiCoach.service";

describe("AiCoachService", () => {
  test("harus membuat context ringkas untuk chat AI coach", () => {
    const service = new AiCoachService();

    const context = service.buildCoachContext({
      user: {
        id: "user-1",
        fullName: "Budi",
        level: 4,
        streak: 3,
        target_final: "weight_loss",
        body_mass_index: 26.4,
      },
      recentMessages: [
        { sender: "user", content: "Aku capek" },
        { sender: "ai", content: "Coba fokus 10 menit dulu" },
      ],
      activeQuests: [
        {
          id: "q1",
          quest: { title: "Jalan santai 20 menit", quest_category: "daily" },
        },
      ],
    });

    expect(context).toContain("Budi");
    expect(context).toContain("weight_loss");
    expect(context).toContain("Jalan santai 20 menit");
    expect(context).toContain("Aku capek");
  });

  test("harus membuat reminder pesan missed quest dengan tone motivasi", () => {
    const service = new AiCoachService();

    const message = service.buildMissedQuestMessage({
      userName: "Budi",
      questTitle: "Jalan santai 20 menit",
      missedHours: 18,
    });

    expect(message).toContain("Budi");
    expect(message).toContain("Jalan santai 20 menit");
    expect(message).toContain("18 jam");
    expect(message).toContain("motivasi");
  });
});
