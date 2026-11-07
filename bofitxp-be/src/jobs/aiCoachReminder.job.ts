import { AiCoachService } from "../services/aiCoach.service";

export class AiCoachReminderJob {
  private intervalId?: NodeJS.Timeout;

  constructor(private readonly aiCoachService = new AiCoachService()) {}

  start() {
    if (this.intervalId) {
      return;
    }

    void this.run();

    this.intervalId = setInterval(
      () => {
        void this.run();
      },
      15 * 60 * 1000,
    );
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  async run() {
    try {
      const result = await this.aiCoachService.processMissedQuestReminders();
      return result;
    } catch (error) {
      console.error("Failed to process AI coach reminders:", error);
      return [];
    }
  }
}

export default new AiCoachReminderJob();
