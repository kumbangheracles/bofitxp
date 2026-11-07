import app from "./app";
import { AiCoachReminderJob } from "./jobs/aiCoachReminder.job";
import logger from "./utils/pino";

const PORT = process.env.PORT || 3000;
const aiCoachReminderJob = new AiCoachReminderJob();

app.listen(Number(PORT), "0.0.0.0", () => {
  aiCoachReminderJob.start();
  logger.info(`Server is running on port ${PORT}`);
});
