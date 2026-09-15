import { Request, Response } from "express";
import {
  GeneratedQuest,
  UserQuestService,
} from "../services/userQuest.service";
import logger from "../utils/pino";
import { IReqUser } from "../middlewares/auth.middleware";
const userQuestService = new UserQuestService();
export default {
  async generateQuests(req: Request, res: Response) {
    const userId = (req as IReqUser).user?.id;
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
          result = await userQuestService.generateQuests(
            userId,
            questTotal ?? 5,
          );
          break;

        case "weekly":
          result = await userQuestService.generateQuestsWeekly(
            userId,
            questTotal ?? 3,
          );
          break;

        case "special":
          result = await userQuestService.generateQuestsSpecial(
            userId,
            questTotal ?? 2,
          );
          break;

        default:
          return res.status(400).json({
            message:
              "Invalid quest category. Available categories: daily, weekly, special",
            data: null,
          });
      }

      logger.info(
        {
          userId,
          category,
          quests: result.quests,
        },
        result.message,
      );

      return res.status(200).json({
        message: result.message,
        data: result.quests,
      });
    } catch (error: any) {
      logger.error(
        {
          err: error,
          quest_category: quest_category,
        },
        "Failed generate quests",
      );

      return res.status(400).json({
        message: error.message,
        data: null,
      });
    }
  },

  async finishedQuest(req: Request, res: Response) {
    try {
      const { userQuestId, questId } = req.params;
      const userId = (req as IReqUser).user?.id;
      const result = await userQuestService.finishedQuest(
        userQuestId,
        userId as string,
        questId,
      );
      logger.info(
        { quests: result },
        `Success update ${result.quest.quest.title} quests`,
      );

      return res.status(200).json({
        message: "Success finishing quests",
        data: result,
      });
    } catch (error: any) {
      const status = error.message === "Invalid Id" ? 403 : 400;
      logger.error(
        {
          err: error,
        },
        "Failed finishing quests",
      );
      return res.status(status).json({
        message: error.message,
        data: null,
      });
    }
  },

  async getAll(req: Request, res: Response) {
    const { quest_category } = req.query;
    try {
      const userId = (req as IReqUser).user?.id;

      if (!userId) {
        return res.status(403).json({
          message: "Unauthorized",
          data: null,
        });
      }

      const results = await userQuestService.getAllQuests(
        userId,
        quest_category as GeneratedQuest["quest_category"],
      );
      logger.info(
        { quests: results },
        `Success get all ${quest_category} quests`,
      );

      return res.status(200).json({
        message: `Success get all ${quest_category} quests`,
        data: results,
      });
    } catch (error: any) {
      const status = error.message === "Invalid Id" ? 403 : 400;
      logger.error(
        {
          err: error,
          quest_category,
        },
        `Failed get all quests ${quest_category}`,
      );
      return res.status(status).json({
        message: error.message,
        data: null,
      });
    }
  },
};
