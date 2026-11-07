import { Request, Response } from "express";
import aiCoachService from "../services/aiCoach.service";
import { IReqUser } from "../middlewares/auth.middleware";

export default {
  async createSession(req: Request, res: Response) {
    try {
      const userId = (req as IReqUser).user?.id;

      if (!userId) {
        return res.status(403).json({
          message: "Unauthorized",
          data: null,
        });
      }

      const { title } = req.body ?? {};
      const session = await aiCoachService.createSession(userId, title);

      return res.status(201).json({
        message: "AI coach session created",
        data: session,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
        data: null,
      });
    }
  },

  async listSessions(req: Request, res: Response) {
    try {
      const userId = (req as IReqUser).user?.id;

      if (!userId) {
        return res.status(403).json({
          message: "Unauthorized",
          data: null,
        });
      }

      const sessions = await aiCoachService.getSessions(userId);

      return res.status(200).json({
        message: "AI coach sessions fetched",
        data: sessions,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
        data: null,
      });
    }
  },

  async getMessages(req: Request, res: Response) {
    try {
      const userId = (req as IReqUser).user?.id;
      const { sessionId } = req.params;

      if (!userId) {
        return res.status(403).json({
          message: "Unauthorized",
          data: null,
        });
      }

      const session = await aiCoachService.getSessionById(userId, sessionId);

      if (!session) {
        return res.status(404).json({
          message: "Session not found",
          data: null,
        });
      }

      return res.status(200).json({
        message: "Messages fetched",
        data: session.messages,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
        data: null,
      });
    }
  },

  async sendMessage(req: Request, res: Response) {
    try {
      const userId = (req as IReqUser).user?.id;
      const { sessionId } = req.params;
      const { content } = req.body ?? {};

      if (!userId) {
        return res.status(403).json({
          message: "Unauthorized",
          data: null,
        });
      }

      if (!content || !content.trim()) {
        return res.status(400).json({
          message: "Message content is required",
          data: null,
        });
      }

      const result = await aiCoachService.sendMessage(
        userId,
        sessionId,
        content.trim(),
      );

      return res.status(200).json({
        message: "Message sent to AI coach",
        data: result,
      });
    } catch (error: any) {
      const status = error.message === "Session not found" ? 404 : 400;
      return res.status(status).json({
        message: error.message,
        data: null,
      });
    }
  },

  async processReminders(req: Request, res: Response) {
    try {
      const result = await aiCoachService.processMissedQuestReminders();

      return res.status(200).json({
        message: "Missed quest reminder processing complete",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
        data: null,
      });
    }
  },
};
