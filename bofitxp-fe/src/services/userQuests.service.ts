import instance from "@/utils/axios/instance";

export class UserQuestService {
  async generateQuests(id: string) {
    const result = await instance.post(`/generate-user-quests/${id}`);

    return result.data.message;
  }

  async getAllUserQuests(id: string) {
    const result = await instance.get(`/user-quests/${id}`);

    return result.data.data;
  }
}
