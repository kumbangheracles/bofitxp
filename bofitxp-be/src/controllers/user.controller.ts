import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { Users } from "../generated/prisma/client";
import response from "../utils/response";
import { UserService } from "../services/user.service";
import logger from "../utils/pino";
import { IReqUser } from "../middlewares/auth.middleware";

export type TUpdateUser = Omit<Users, "password" | "activationCode" | "id">;
const userService = new UserService();
export default {
  async updateUser(req: Request, res: Response) {
    const payload = req.body as unknown as TUpdateUser;
    const userId = (req as IReqUser).user?.id;
    try {
      const { updatedUser } = await userService.update(payload, userId as string);
      logger.info({ user: updatedUser }, "Success update user");
      response.success(res, updatedUser, "Success update user");
    } catch (error) {
      logger.error(
        {
          err: error,
          username: payload.username,
        },
        "Failed update user",
      );
      response.error(res, error, "Failed update user");
    }
  },
};
