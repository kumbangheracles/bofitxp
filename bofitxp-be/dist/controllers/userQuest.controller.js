"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userQuest_service_1 = require("../services/userQuest.service");
const pino_1 = __importDefault(require("../utils/pino"));
const userQuestService = new userQuest_service_1.UserQuestService();
exports.default = {
    async generateQuests(req, res) {
        const userId = req.user?.id;
        const { quest_category, total } = req.query;
        try {
            if (!userId) {
                return res.status(403).json({
                    message: "Unauthorized",
                    data: null,
                });
            }
            const category = quest_category?.toString() || "daily";
            const questTotal = total ? Number(total) : undefined;
            let result;
            switch (category) {
                case "daily":
                    result = await userQuestService.generateQuestsDaily(userId, questTotal ?? 5);
                    break;
                case "weekly":
                    result = await userQuestService.generateQuestsWeekly(userId, questTotal ?? 3);
                    break;
                case "special":
                    result = await userQuestService.generateQuestsSpecial(userId, questTotal ?? 2);
                    break;
                default:
                    return res.status(400).json({
                        message: "Invalid quest category. Available categories: daily, weekly, special",
                        data: null,
                    });
            }
            pino_1.default.info({
                userId,
                category,
                quests: result.quests,
            }, result.message);
            return res.status(200).json({
                message: result.message,
                data: result.quests,
            });
        }
        catch (error) {
            pino_1.default.error({
                err: error,
                quest_category: quest_category,
            }, "Failed generate quests");
            return res.status(400).json({
                message: error.message,
                data: null,
            });
        }
    },
    async finishedQuest(req, res) {
        try {
            const { userQuestId, questId } = req.params;
            const userId = req.user?.id;
            const result = await userQuestService.finishedQuest(userQuestId, userId, questId);
            pino_1.default.info({ quests: result }, `Success update ${result.quest.quest.title} quests`);
            return res.status(200).json({
                message: "Success finishing quests",
                data: result,
            });
        }
        catch (error) {
            const status = error.message === "Invalid Id" ? 403 : 400;
            pino_1.default.error({
                err: error,
            }, "Failed finishing quests");
            return res.status(status).json({
                message: error.message,
                data: null,
            });
        }
    },
    async getAll(req, res) {
        const { quest_category } = req.query;
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(403).json({
                    message: "Unauthorized",
                    data: null,
                });
            }
            const results = await userQuestService.getAllQuests(userId, quest_category);
            pino_1.default.info({ quests: results }, `Success get all ${quest_category} quests`);
            return res.status(200).json({
                message: `Success get all ${quest_category} quests`,
                data: results,
            });
        }
        catch (error) {
            const status = error.message === "Invalid Id" ? 403 : 400;
            pino_1.default.error({
                err: error,
                quest_category,
            }, `Failed get all quests ${quest_category}`);
            return res.status(status).json({
                message: error.message,
                data: null,
            });
        }
    },
};
