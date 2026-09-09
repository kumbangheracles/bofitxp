import { QuestCategory } from "@/types/quests.type";
import instance from "@/utils/axios/instance";

export class UserQuestService {
  async generateQuests(id: string) {
    const result = await instance.post(`/generate-user-quests/${id}`);

    return result.data.message;
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

  async finsihedQuest(id: string, userId: string, questId: string) {
    const result = await instance.patch(
      `/user-quests/${id}/${userId}/${questId}`,
    );

    return result.data.data;
  }
}
