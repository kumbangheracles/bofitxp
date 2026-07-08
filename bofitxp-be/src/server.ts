import app from "./app";
import { JobService } from "./jobs/ttl_init_index";
import db from "./utils/database";
const PORT = process.env.PORT || 3000;
const jobService = new JobService();
async function startServer() {
  try {
    const dbStatus = await db();
    console.log("Database status: ", dbStatus);
    jobService.setupTTLIndex();
    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Server is running and listening globally on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server due to a database error.", error);
    process.exit(1);
  }
}

startServer();
