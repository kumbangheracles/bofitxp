import { QuestCategory, QuestCategoryType } from "@/types/quests.type";
import instance from "@/utils/axios/instance";

export class UserQuestService {
  async generateQuests(quest_category: QuestCategoryType) {
    const result = await instance.post(
      `/user-quests/generate`,
      {},
      {
        params: {
          quest_category,
        },
      },
    );

    return result.data.message;
  }

  async getAllUserQuests(quest_category: QuestCategoryType) {
    const result = await instance.get(`/user-quests`, {
      params: {
        quest_category,
      },
    });

    return result.data.data;
  }

  async getAllUserQuestsDaily() {
    const result = await instance.get(`/user-quests`, {
      params: {
        quest_category: QuestCategory.DAILY,
      },
    });

    return result.data.data;
  }
  async getAllUserQuestsWeekly() {
    const result = await instance.get(`/user-quests`, {
      params: {
        quest_category: QuestCategory.WEEKLY,
      },
    });

    return result.data.data;
  }
  async getAllUserQuestsSpecial() {
    const result = await instance.get(`/user-quests`, {
      params: {
        quest_category: QuestCategory.SPECIAL,
      },
    });

    return result.data.data;
  }

  async finsihedQuest(userQuestId: string, questId: string) {
    console.log("BEFORE PATCH CALL");
    const result = await instance.patch(
      `/user-quests/${userQuestId}/${questId}`,
    );
    console.log("AFTER PATCH CALL"); // <-- apakah ini muncul?
    return result.data.data;
  }
}
