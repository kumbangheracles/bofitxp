import { UserQuest } from "../generated/prisma/client";
import prisma from "../utils/prisma";

import groq from "../utils/groq";

interface GeneratedQuest {
  title: string;
  quest_type: "cardio" | "lifting" | "thinking" | "meditating" | "unknown";
  difficulty: "easy" | "medium" | "hard";
  xp_reward: number;
}

interface GeneratedQuestResponse {
  quests: GeneratedQuest[];
}
export class UserQuestService {
  async generateQuests(userId: UserQuest["userId"], total: number = 10) {
    if (!userId) {
      throw new Error("Invalid user id");
    }

    if (total < 1 || total > 50) {
      throw new Error("Total quest must be between 1 and 50");
    }

    /*
     * 1. Cari user
     */
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
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    /*
     * 2. Generate quest menggunakan Groq
     */
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
You are an AI quest generator for a fitness and self-improvement gamification application called BOFITXP.

Your job is to generate quests that help users improve:
- physical fitness
- strength
- cardiovascular health
- mental focus
- meditation
- healthy habits

Available quest types:
- cardio
- lifting
- thinking
- meditating
- unknown

Available difficulties:
- easy
- medium
- hard

XP reward rules:
- easy: 10 - 30 XP
- medium: 31 - 70 XP
- hard: 71 - 120 XP

Important rules:
- Every quest must be realistic.
- Every quest must be achievable.
- Avoid dangerous exercises.
- Avoid extreme exercise volumes.
- Titles must clearly describe what the user needs to do.
- Do not generate duplicate quests.
- Use Indonesian language for quest titles.
`,
        },

        {
          role: "user",
          content: `
Generate exactly ${total} quests for this user.

User information:

Name: ${user.fullName}
Level: ${user.level ?? 0}
Current XP: ${user.xp ?? 0}
Weight: ${user.body_weight} kg
Height: ${user.body_height} cm
BMI: ${user.body_mass_index}

Generate a balanced combination of:
- cardio
- lifting
- thinking
- meditating

Adjust difficulty based primarily on the user's level.

Return exactly ${total} quests.
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

                minItems: total,
                maxItems: total,

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
                      enum: ["easy", "medium", "hard"],
                    },

                    xp_reward: {
                      type: "integer",
                      minimum: 10,
                      maximum: 120,
                    },
                  },

                  required: ["title", "quest_type", "difficulty", "xp_reward"],

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

    /*
     * 3. Ambil response AI
     */
    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("AI failed to generate quests");
    }

    /*
     * 4. Parse JSON
     */
    const generatedData = JSON.parse(content) as GeneratedQuestResponse;

    if (!generatedData.quests) {
      throw new Error("Invalid AI response");
    }

    if (generatedData.quests.length !== total) {
      throw new Error(
        `AI generated ${generatedData.quests.length} quests instead of ${total}`,
      );
    }

    /*
     * 5. Buat Quest + hubungkan ke User
     */
    const createdQuests = await Promise.all(
      generatedData.quests.map(async (quest) => {
        const createdQuest = await prisma.quests.create({
          data: {
            title: quest.title,
            quest_type: quest.quest_type,
            difficulty: quest.difficulty,
            xp_reward: quest.xp_reward,

            userQuests: {
              create: {
                userId,
              },
            },
          },

          include: {
            userQuests: true,
          },
        });

        return createdQuest;
      }),
    );

    return {
      message: `${createdQuests.length} quests successfully generated`,
      total: createdQuests.length,
      quests: createdQuests,
    };
  }

  async getAllQuests(id: UserQuest["userId"]) {
    if (!id) {
      throw new Error("Invalid id");
    }

    const quests = await prisma.userQuest.findMany({
      where: {
        userId: id,
      },
      include: {
        quest: true,
      },
    });

    return quests;
  }
}
