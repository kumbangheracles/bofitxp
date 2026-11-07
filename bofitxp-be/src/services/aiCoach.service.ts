import { Prisma } from "../generated/prisma/client";
import prisma from "../utils/prisma";
import { ensureGroqClient } from "../utils/groq";
import logger from "../utils/pino";

export type AiCoachSender = "user" | "ai";

interface BuildCoachContextInput {
  user: {
    id?: string;
    fullName: string;
    level?: number | null;
    streak?: number | null;
    target_final?: string | null;
    body_mass_index?: number | null;
  };
  recentMessages: Array<{
    sender: AiCoachSender | string;
    content: string;
  }>;
  activeQuests: Array<{
    id: string;
    quest: {
      title: string;
      quest_category?: string | null;
    };
  }>;
}

interface MissedQuestReminderInput {
  userName: string;
  questTitle: string;
  missedHours: number;
}

export class AiCoachService {
  buildCoachContext({
    user,
    recentMessages,
    activeQuests,
  }: BuildCoachContextInput): string {
    const questSummary =
      activeQuests.length > 0
        ? activeQuests.map((quest) => quest.quest.title).join("; ")
        : "Belum ada quest aktif";

    const recentChat = recentMessages.length
      ? recentMessages
          .map(
            (message) =>
              `${message.sender === "user" ? "User" : "AI"}: ${message.content}`,
          )
          .join("\n")
      : "Belum ada riwayat chat.";

    return [
      "=== AI COACH CONTEXT ===",
      `User: ${user.fullName}`,
      `Level: ${user.level ?? 0}`,
      `Streak: ${user.streak ?? 0}`,
      `Target: ${user.target_final ?? "not set"}`,
      `BMI: ${user.body_mass_index ?? "not set"}`,
      `Quest aktif: ${questSummary}`,
      "",
      "Riwayat chat:",
      recentChat,
    ].join("\n");
  }

  buildMissedQuestMessage({
    userName,
    questTitle,
    missedHours,
  }: MissedQuestReminderInput): string {
    return `Halo ${userName}, aku melihat quest "${questTitle}" belum kamu selesaikan sejak ${missedHours} jam yang lalu. Kamu masih punya momentum, jadi mari fokus satu langkah kecil dan kembali ke rutinitas hari ini. Ini reminder motivasi supaya kamu tetap konsisten.`;
  }

  async createSession(userId: string, title?: string) {
    return prisma.aiCoachSession.create({
      data: {
        userId,
        title: title ?? "AI Coach Session",
        status: "ACTIVE",
      },
    });
  }

  async getSessions(userId: string) {
    return prisma.aiCoachSession.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          take: 20,
        },
      },
    });
  }

  async getSessionById(userId: string, sessionId: string) {
    return prisma.aiCoachSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  async getSessionMessages(sessionId: string) {
    return prisma.aiCoachMessage.findMany({
      where: {
        sessionId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async createReminder({
    userId,
    sessionId,
    type,
    title,
    body,
    scheduledAt,
    metadata,
  }: {
    userId: string;
    sessionId?: string | null;
    type: "missed_quest" | "streak_warning" | "motivation" | "wellness_checkin";
    title: string;
    body: string;
    scheduledAt: Date;
    metadata?: Prisma.InputJsonValue | null;
  }) {
    return prisma.aiCoachReminder.create({
      data: {
        userId,
        sessionId: sessionId ?? null,
        type,
        title,
        body,
        scheduledAt,
        metadata: metadata ?? undefined,
      },
    });
  }

  async sendMessage(userId: string, sessionId: string, content: string) {
    const session = await this.getSessionById(userId, sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    const userMessage = await prisma.aiCoachMessage.create({
      data: {
        sessionId,
        sender: "USER",
        content,
      },
    });

    const sessionUser = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        fullName: true,
        level: true,
        streak: true,
        target_final: true,
        body_mass_index: true,
      },
    });

    const aiReply = await this.generateCoachReply({
      userId,
      sessionId,
      userMessage: content,
      context: this.buildCoachContext({
        user: {
          fullName: sessionUser?.fullName ?? "User",
          level: sessionUser?.level ?? 0,
          streak: sessionUser?.streak ?? 0,
          target_final: sessionUser?.target_final ?? null,
          body_mass_index: sessionUser?.body_mass_index ?? null,
        },
        recentMessages: session.messages.map((message) => ({
          sender: message.sender === "USER" ? "user" : "ai",
          content: message.content,
        })),
        activeQuests: [],
      }),
    });

    const aiMessage = await prisma.aiCoachMessage.create({
      data: {
        sessionId,
        sender: "AI",
        content: aiReply,
      },
    });

    await prisma.aiCoachSession.update({
      where: {
        id: sessionId,
      },
      data: {
        summary: aiReply,
        updatedAt: new Date(),
      },
    });

    return {
      userMessage,
      aiMessage,
    };
  }

  async generateCoachReply({
    userId,
    sessionId,
    userMessage,
    context,
  }: {
    userId: string;
    sessionId: string;
    userMessage: string;
    context: string;
  }) {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        fullName: true,
        level: true,
        streak: true,
        target_final: true,
        body_mass_index: true,
      },
    });

    const activeQuests = await prisma.userQuest.findMany({
      where: {
        userId,
        is_finished: false,
      },
      include: {
        quest: true,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    const recentMessages = await prisma.aiCoachMessage.findMany({
      where: {
        sessionId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
      select: {
        sender: true,
        content: true,
      },
    });

    const coachContext = this.buildCoachContext({
      user: {
        fullName: user?.fullName ?? "User",
        level: user?.level ?? 0,
        streak: user?.streak ?? 0,
        target_final: user?.target_final ?? null,
        body_mass_index: user?.body_mass_index ?? null,
      },
      recentMessages: recentMessages
        .slice()
        .reverse()
        .map((message) => ({
          sender: message.sender === "USER" ? "user" : "ai",
          content: message.content,
        })),
      activeQuests: activeQuests.map((activeQuest) => ({
        id: activeQuest.id,
        quest: {
          title: activeQuest.quest.title,
          quest_category: activeQuest.quest.quest_category,
        },
      })),
    });

    try {
      const groq = ensureGroqClient();
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah AI coach untuk BOFITXP. Jawab singkat, memotivasi, fokus pada progress user, dan jangan memberi saran yang berbahaya.",
          },
          {
            role: "user",
            content: `${coachContext}\n\nUser message: ${userMessage}`,
          },
        ],
        temperature: 0.8,
        include_reasoning: false,
      });

      const reply = completion.choices[0]?.message?.content?.trim();

      if (reply) {
        return reply;
      }
    } catch (error) {
      logger.warn({ err: error }, "AI coaching fallback activated");
    }

    return "Aku lihat kamu sedang berusaha. Fokuslah pada satu langkah kecil hari ini: selesaikan quest paling sederhana dan lanjutkan momentummu dengan konsisten.";
  }

  async processMissedQuestReminders() {
    const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const overdueQuests = await prisma.userQuest.findMany({
      where: {
        is_finished: false,
        createdAt: {
          lt: threshold,
        },
      },
      include: {
        user: true,
        quest: true,
      },
    });

    const results: Array<{
      userId: string;
      reminder: any;
      sessionId?: string | null;
    }> = [];

    for (const activeQuest of overdueQuests) {
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const existingReminder = await prisma.aiCoachReminder.findFirst({
        where: {
          userId: activeQuest.userId,
          type: "missed_quest",
          scheduledAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      });

      if (existingReminder) {
        continue;
      }

      const missedHours = Math.max(
        1,
        Math.round(
          (Date.now() - new Date(activeQuest.createdAt).getTime()) /
            (1000 * 60 * 60),
        ),
      );

      const body = this.buildMissedQuestMessage({
        userName: activeQuest.user.fullName,
        questTitle: activeQuest.quest.title,
        missedHours,
      });

      const session = await prisma.aiCoachSession.findFirst({
        where: {
          userId: activeQuest.userId,
          status: "ACTIVE",
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      const reminder = await this.createReminder({
        userId: activeQuest.userId,
        sessionId: session?.id,
        type: "missed_quest",
        title: "Quest tertinggal",
        body,
        scheduledAt: new Date(),
        metadata: {
          questId: activeQuest.questId,
          userQuestId: activeQuest.id,
          missedHours,
        },
      });

      if (session) {
        await prisma.aiCoachMessage.create({
          data: {
            sessionId: session.id,
            sender: "AI",
            content: body,
          },
        });
      }

      results.push({
        userId: activeQuest.userId,
        reminder,
        sessionId: session?.id,
      });
    }

    return results;
  }
}

export default new AiCoachService();
