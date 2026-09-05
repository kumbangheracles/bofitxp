import { Request, Response } from "express";
import { UserQuestService } from "../services/userQuest.service";
import logger from "../utils/pino";
const userQuestService = new UserQuestService();
export default {
  async generateQuests(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { message, quests } = await userQuestService.generateQuests(id);
      logger.info({ questes: quests }, message);
      return res.status(200).json({
        message: message,
      });
    } catch (error: any) {
      const status = error.message === "Invalid Id" ? 403 : 400;
      logger.error(error);
      return res.status(status).json({
        message: error.message,
        data: null,
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const results = await userQuestService.getAllQuests(id);
      logger.info({ quests: results }, "Success");

      return res.status(200).json({
        message: "Success",
        data: results,
      });
    } catch (error: any) {
      const status = error.message === "Invalid Id" ? 403 : 400;
      logger.error(error);
      return res.status(status).json({
        message: error.message,
        data: null,
      });
    }
  },
};
