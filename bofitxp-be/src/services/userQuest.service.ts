import { Difficulty, UserQuest } from "../generated/prisma/client";
import prisma from "../utils/prisma";

import groq from "../utils/groq";
import { XP_REWARD } from "../utils/constants/xp";
import logger from "../utils/pino";

export interface GeneratedQuest {
  title: string;
  quest_type: "cardio" | "lifting" | "thinking" | "meditating" | "unknown";
  difficulty: "easy" | "medium" | "hard";
  quest_category: "daily" | "weekly" | "special";
  xp_reward: number;
}

interface QuestGenerationConfig {
  total: number;
  quest_type?: "cardio" | "lifting" | "thinking" | "meditating" | "unknown";
  quest_category: "daily" | "weekly" | "special";
  difficulties: ("easy" | "medium" | "hard")[];
  minXp: number;
  maxXp: number;
}

interface GeneratedQuestResponse {
  quests: GeneratedQuest[];
}
export class UserQuestService {
  private async generateQuestWithAI(
    userId: UserQuest["userId"],
    config: QuestGenerationConfig,
  ) {
    if (!userId) {
      throw new Error("Invalid user id");
    }

    if (config.total < 1 || config.total > 50) {
      throw new Error("Total quest must be between 1 and 50");
    }

    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        level: true,
        xp: true,
        body_weight: true,
        body_height: true,
        body_mass_index: true,
        target_final: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.body_mass_index == null) {
      throw new Error("BMI is required!.");
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
You are an AI quest generator for BOFITXP.

BOFITXP is a fitness and self-improvement gamification application.

Your job is to generate quests appropriate for the requested quest category.

Available quest types:
${config.quest_type}

Available difficulties:
${config.difficulties.join(", ")}

Quest category:
${config.quest_category}

IMPORTANT RULES:

1. Generate exactly the requested number of quests.
2. Every quest must use one of the allowed difficulties.
3. Do not generate duplicate quests.
4. Quest titles must be written in Indonesian.
5. Quests must be realistic and achievable.
6. Avoid dangerous exercises.
7. Avoid extreme exercise volume.
8. The quest must match its quest type.
9. Consider the user's level when determining difficulty.
10. For special quests, make them significantly more challenging than normal quests.
11. Difficulty must accurately reflect the actual difficulty of the quest.
12. Do not generate XP values. XP rewards are determined by the BOFITXP backend based on difficulty.
`,
        },

        {
          role: "user",
          content: `
Generate exactly ${config.total} ${config.quest_category} quests.

User information:

Name: ${user.fullName}
Level: ${user.level ?? 0}
Current XP: ${user.xp ?? 0}
Weight: ${user.body_weight} kg
Height: ${user.body_height} cm
BMI: ${user.body_mass_index}
Final Target: ${user.target_final}

Quest requirements:

Category:
${config.quest_category}

Allowed difficulties:
${config.difficulties.join(", ")}

IMPORTANT GUIDELINES FOR PERSONALIZATION:
- If Final Target is 'weight_loss' or BMI indicates overweight, prioritize cardio, endurance, and calorie-burning quests with safe, joint-friendly volumes (avoid high-impact stress on knees).
- If Final Target is 'muscle_gain', emphasize lifting, progressive resistance, and structured body-weight strength quests.
- Tailor the intensity of the quests strictly to the user's current Level (${user.level ?? 0}) and BMI.

Generate exactly ${config.total} quests.

Do not include XP rewards.
The backend will determine XP based on quest difficulty.

Return only the requested JSON structure.
`,
        },
      ],

      response_format: {
        type: "json_schema",

        json_schema: {
          name: "generated_quests",

          schema: {
            type: "object",

            properties: {
              quests: {
                type: "array",

                minItems: config.total,
                maxItems: config.total,

                items: {
                  type: "object",

                  properties: {
                    title: {
                      type: "string",
                    },

                    quest_type: {
                      type: "string",
                      enum: [
                        "cardio",
                        "lifting",
                        "thinking",
                        "meditating",
                        "unknown",
                      ],
                    },

                    difficulty: {
                      type: "string",
                      enum: config.difficulties,
                    },
                  },

                  required: ["title", "quest_type", "difficulty"],

                  additionalProperties: false,
                },
              },
            },

            required: ["quests"],

            additionalProperties: false,
          },
        },
      },

      temperature: 0.8,
      include_reasoning: false,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("AI failed to generate quests");
    }

    let generatedData: GeneratedQuestResponse;

    try {
      generatedData = JSON.parse(content);
    } catch {
      throw new Error("AI returned invalid JSON");
    }

    if (!generatedData.quests) {
      throw new Error("Invalid AI response");
    }

    if (generatedData.quests.length !== config.total) {
      throw new Error(
        `AI generated ${generatedData.quests.length} quests instead of ${config.total}`,
      );
    }

    /*
     * Validate hasil AI sekali lagi
     * Jangan hanya mengandalkan prompt/schema.
     */
    for (const quest of generatedData.quests) {
      if (!config.difficulties.includes(quest.difficulty)) {
        throw new Error(`Invalid difficulty generated: ${quest.difficulty}`);
      }
    }

    /*
     * Create Quest + UserQuest
     */
    const createdQuests = await prisma.$transaction(
      generatedData.quests.map((quest) =>
        prisma.quests.create({
          data: {
            title: quest.title,
            quest_type: quest.quest_type,
            difficulty: quest.difficulty,

            xp_reward: XP_REWARD[quest.difficulty],

            quest_category: config.quest_category,

            userQuests: {
              create: {
                userId,
              },
            },
          },

          include: {
            userQuests: true,
          },
        }),
      ),
    );

    return {
      message: `${createdQuests.length} ${config.quest_category} quests successfully generated`,
      type: config.quest_category,
      total: createdQuests.length,
      quests: createdQuests,
    };
  }

  async generateQuestsDaily(userId: UserQuest["userId"], total: number = 5) {
    const allDailyQuests = await this.getAllQuests(userId, "daily");

    const mappingQuestId = allDailyQuests.map((item) => item.questId);

    await prisma.userQuest.deleteMany({
      where: {
        userId,
        questId: {
          in: mappingQuestId,
        },
      },
    });

    return this.generateQuestWithAI(userId, {
      total,
      quest_category: "daily",
      difficulties: ["easy", "medium", "hard"],
      minXp: 10,
      maxXp: 120,
    });
  }

  async generateQuestsWeekly(userId: UserQuest["userId"], total: number = 3) {
    const allWeeklyQuest = await this.getAllQuests(userId, "weekly");
    const mappingQuestId = allWeeklyQuest.map((item) => item.questId);

    await prisma.userQuest.deleteMany({
      where: {
        userId,
        questId: {
          in: mappingQuestId,
        },
      },
    });

    return this.generateQuestWithAI(userId, {
      total,
      quest_category: "weekly",

      difficulties: ["medium", "hard"],

      minXp: 100,
      maxXp: 500,
    });
  }

  async generateQuestsSpecial(userId: UserQuest["userId"], total: number = 2) {
    const allSpecialQuest = await this.getAllQuests(userId, "special");
    const mappingQuestId = allSpecialQuest.map((item) => item.questId);

    await prisma.userQuest.deleteMany({
      where: {
        userId,
        questId: {
          in: mappingQuestId,
        },
      },
    });

    return this.generateQuestWithAI(userId, {
      total,
      quest_category: "special",

      difficulties: ["hard"],

      minXp: 600,
      maxXp: 1000,
    });
  }
  private getQuestXpReward(difficulty: Difficulty): number {
    return XP_REWARD[difficulty];
  }
  async finishedQuest(
    id: UserQuest["id"],
    userId: UserQuest["userId"],
    questId: UserQuest["questId"],
  ) {
    if (!id || !userId || !questId) {
      throw new Error("Invalid id");
    }

    // Pastikan quest memang milik user dan belum selesai
    const userQuest = await prisma.userQuest.findFirst({
      where: {
        id,
        userId,
        questId,
      },
      include: {
        quest: true,
      },
    });

    if (!userQuest) {
      throw new Error("Quest not found");
    }

    if (userQuest.is_finished) {
      throw new Error("Quest already completed");
    }

    // Tandai quest sebagai selesai
    const finishedQuest = await prisma.userQuest.update({
      where: {
        id: userQuest.id,
      },
      data: {
        is_finished: true,
      },
      include: {
        quest: true,
      },
    });

    // Ambil XP berdasarkan difficulty quest
    const xpReward = this.getQuestXpReward(finishedQuest.quest.difficulty);

    // Tambahkan XP ke user
    const xpResult = await this.addXp(userId, xpReward);

    return {
      quest: finishedQuest,
      xp: {
        gained: xpReward,
        total: xpResult.user.xp,
        level: xpResult.currentLevel,
        levelUp: xpResult.levelUp,
      },
    };
  }
  private calculateLevel(xp: number): number {
    let level = 0;

    while (xp >= this.getLevelThreshold(level + 1)) {
      level++;
    }

    return level;
  }

  private getLevelThreshold(level: number): number {
    if (level <= 0) return 0;

    return Math.floor(100 * Math.pow(level, 1.35));
  }
  async addXp(userId: string, amount: number) {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const currentXp = user.xp ?? 0;
    const currentLevel = user.level ?? 0;

    const newXp = currentXp + amount;

    const newLevel = this.calculateLevel(newXp);

    const levelUp = newLevel > currentLevel;

    const updatedUser = await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        xp: newXp,
        level: newLevel,
      },
    });

    logger.info({ message: "Success add xp", updatedUser });

    return {
      user: updatedUser,
      xpGained: amount,
      levelUp,
      previousLevel: currentLevel,
      currentLevel: newLevel,
    };
  }

  //   async generateQuests(userId: UserQuest["userId"], total: number = 5) {
  //     if (!userId) {
  //       throw new Error("Invalid user id");
  //     }

  //     if (total < 1 || total > 50) {
  //       throw new Error("Total quest must be between 1 and 50");
  //     }

  //     /*
  //      * 1. Cari user
  //      */
  //     const user = await prisma.users.findUnique({
  //       where: {
  //         id: userId,
  //       },
  //       select: {
  //         id: true,
  //         fullName: true,
  //         level: true,
  //         xp: true,
  //         body_weight: true,
  //         body_height: true,
  //         body_mass_index: true,
  //       },
  //     });

  //     if (!user) {
  //       throw new Error("User not found");
  //     }

  //     /*
  //      * 2. Generate quest menggunakan Groq
  //      */
  //     const completion = await groq.chat.completions.create({
  //       model: "openai/gpt-oss-20b",

  //       messages: [
  //         {
  //           role: "system",
  //           content: `
  // You are an AI quest generator for a fitness and self-improvement gamification application called BOFITXP.

  // Your job is to generate quests that help users improve:
  // - physical fitness
  // - strength
  // - cardiovascular health
  // - mental focus
  // - meditation
  // - healthy habits

  // Available quest types:
  // - cardio
  // - lifting
  // - thinking
  // - meditating
  // - unknown

  // Available difficulties:
  // - easy
  // - medium
  // - hard

  // XP reward rules:
  // - easy: 10 - 30 XP
  // - medium: 31 - 70 XP
  // - hard: 71 - 120 XP

  // Important rules:
  // - Every quest must be realistic.
  // - Every quest must be achievable.
  // - Avoid dangerous exercises.
  // - Avoid extreme exercise volumes.
  // - Titles must clearly describe what the user needs to do.
  // - Do not generate duplicate quests.
  // - Use Indonesian language for quest titles.
  // `,
  //         },

  //         {
  //           role: "user",
  //           content: `
  // Generate exactly ${total} quests for this user.

  // User information:

  // Name: ${user.fullName}
  // Level: ${user.level ?? 0}
  // Current XP: ${user.xp ?? 0}
  // Weight: ${user.body_weight} kg
  // Height: ${user.body_height} cm
  // BMI: ${user.body_mass_index}

  // Generate a balanced combination of:
  // - cardio
  // - lifting
  // - thinking
  // - meditating

  // Adjust difficulty based primarily on the user's level.

  // Return exactly ${total} quests.
  // `,
  //         },
  //       ],

  //       response_format: {
  //         type: "json_schema",

  //         json_schema: {
  //           name: "generated_quests",

  //           schema: {
  //             type: "object",

  //             properties: {
  //               quests: {
  //                 type: "array",

  //                 minItems: total,
  //                 maxItems: total,

  //                 items: {
  //                   type: "object",

  //                   properties: {
  //                     title: {
  //                       type: "string",
  //                     },

  //                     quest_type: {
  //                       type: "string",
  //                       enum: [
  //                         "cardio",
  //                         "lifting",
  //                         "thinking",
  //                         "meditating",
  //                         "unknown",
  //                       ],
  //                     },

  //                     difficulty: {
  //                       type: "string",
  //                       enum: ["easy", "medium", "hard"],
  //                     },

  //                     xp_reward: {
  //                       type: "integer",
  //                       minimum: 10,
  //                       maximum: 120,
  //                     },
  //                   },

  //                   required: ["title", "quest_type", "difficulty", "xp_reward"],

  //                   additionalProperties: false,
  //                 },
  //               },
  //             },

  //             required: ["quests"],

  //             additionalProperties: false,
  //           },
  //         },
  //       },

  //       temperature: 0.8,
  //       include_reasoning: false,
  //     });

  //     /*
  //      * 3. Ambil response AI
  //      */
  //     const content = completion.choices[0]?.message?.content;

  //     if (!content) {
  //       throw new Error("AI failed to generate quests");
  //     }

  //     /*
  //      * 4. Parse JSON
  //      */
  //     const generatedData = JSON.parse(content) as GeneratedQuestResponse;

  //     if (!generatedData.quests) {
  //       throw new Error("Invalid AI response");
  //     }

  //     if (generatedData.quests.length !== total) {
  //       throw new Error(
  //         `AI generated ${generatedData.quests.length} quests instead of ${total}`,
  //       );
  //     }

  //     /*
  //      * 5. Buat Quest + hubungkan ke User
  //      */
  //     const createdQuests = await Promise.all(
  //       generatedData.quests.map(async (quest) => {
  //         const createdQuest = await prisma.quests.create({
  //           data: {
  //             title: quest.title,
  //             quest_type: quest.quest_type,
  //             difficulty: quest.difficulty,
  //             xp_reward: quest.xp_reward,

  //             userQuests: {
  //               create: {
  //                 userId,
  //               },
  //             },
  //           },

  //           include: {
  //             userQuests: true,
  //           },
  //         });

  //         return createdQuest;
  //       }),
  //     );

  //     return {
  //       message: `${createdQuests.length} quests successfully generated`,
  //       total: createdQuests.length,
  //       quests: createdQuests,
  //     };
  //   }

  async getAllQuests(
    id: UserQuest["userId"],
    quest_category: GeneratedQuest["quest_category"],
  ) {
    if (!id) {
      throw new Error("Invalid id");
    }

    const quests = await prisma.userQuest.findMany({
      where: {
        userId: id,
        quest: {
          quest_category,
        },
      },
      include: {
        quest: true,
      },
    });

    return quests;
  }
}
