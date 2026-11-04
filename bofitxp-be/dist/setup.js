"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_1 = __importDefault(require("./utils/prisma"));
const ttl_init_index_1 = require("./jobs/ttl_init_index");
async function setup() {
    try {
        const jobService = new ttl_init_index_1.JobService();
        await jobService.setupTTLIndex();
        console.log("Database setup completed.");
    }
    catch (error) {
        console.error("Database setup failed:", error);
        process.exit(1);
    }
    finally {
        await prisma_1.default.$disconnect();
    }
}
setup();
