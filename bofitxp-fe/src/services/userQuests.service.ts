import { QuestCategory, QuestCategoryType } from "@/types/quests.type";
import instance from "@/utils/axios/instance";

export class UserQuestService {
  async generateQuests(id: string) {
    const result = await instance.post(`/generate-user-quests/${id}`);

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
    const result = await instance.patch(
      `/user-quests/${userQuestId}/${questId}`,
    );

    return result.data.data;
  }
}
