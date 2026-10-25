import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { Users } from "../generated/prisma/client";
import response from "../utils/response";
import { UserService } from "../services/user.service";
import logger from "../utils/pino";
import { IReqUser } from "../middlewares/auth.middleware";
import { generateToken } from "../utils/jwt";
import { getClientIp } from "../utils/otpGuard";

export type TUpdateUser = Omit<Users, "password" | "activationCode" | "id">;
const userService = new UserService();
export default {
  async updateUser(req: Request, res: Response) {
    const payload = req.body as unknown as TUpdateUser;
    const userId = (req as IReqUser).user?.id;
    try {
      const { updatedUser } = await userService.update(
        payload,
        userId as string,
      );

      const userData = updatedUser as any;

      const token = generateToken({
        id: userData.id,
        fullName: userData.fullName,
        username: userData.username,
        email: userData.email,
        isVerified: userData.isVerified,
        gender: userData.gender ?? null,
        age: userData.age ?? null,
        level: userData.level,
        streak: userData.streak,
        avatarUrl: userData.avatarUrl ?? null,
        xp: userData.xp,
        target_final: userData.target_final ?? null,
        createdAt: userData.createdAt,
        body_height: userData.body_height,
        body_weight: userData.body_weight,
        body_mass_index: userData.body_mass_index,
      });

      logger.info({ user: updatedUser }, "Success update user");
      response.success(res, { updatedUser, token }, "Success update user");
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

  async sendOtpConfirmationCode(req: Request, res: Response) {
    const { email } = req.body as { email: string };
    const clientIp = getClientIp(req);

    try {
      await userService.sendOtpConfirmationCode(email, clientIp);
      response.success(res, null, "OTP confirmation code sent successfully");
    } catch (error) {
      logger.error(
        {
          err: error,
          emailHash: email ? email.trim().toLowerCase() : null,
        },
        "Failed to send OTP confirmation code",
      );
      response.error(res, error, "Failed to send OTP confirmation code");
    }
  },

  async resendOtpConfirmationCode(req: Request, res: Response) {
    const { email } = req.body as { email: string };
    const clientIp = getClientIp(req);

    try {
      await userService.resendOtpConfirmationCode(email, clientIp);
      response.success(res, null, "OTP confirmation code resent successfully");
    } catch (error) {
      logger.error(
        {
          err: error,
          emailHash: email ? email.trim().toLowerCase() : null,
        },
        "Failed to resend OTP confirmation code",
      );
      response.error(res, error, "Failed to resend OTP confirmation code");
    }
  },
};
