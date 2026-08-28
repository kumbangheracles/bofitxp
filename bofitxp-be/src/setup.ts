import prisma from "./utils/prisma";
import { JobService } from "./jobs/ttl_init_index";

async function setup() {
  try {
    const jobService = new JobService();

    await jobService.setupTTLIndex();

    console.log("Database setup completed.");
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setup();
