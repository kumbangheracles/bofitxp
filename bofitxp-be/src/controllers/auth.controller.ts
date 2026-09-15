import { Request, Response } from "express";
import { IReqUser } from "../middlewares/auth.middleware";
import prisma from "../utils/prisma";
import response from "../utils/response";
import { AuthService } from "../services/auth.service";
import { Users } from "../generated/prisma/client";
import logger from "../utils/pino";
import { getUserData } from "../utils/jwt";
export type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  email: string;
  password: string;
};
const authService = new AuthService();
export default {
  async register(req: Request, res: Response) {
    const payload = req.body as TRegister;

    logger.info({ username: payload.username }, "Start user registration");

    try {
      const result = await authService.register(payload);

      logger.info(
        { username: payload.username },
        "User registration successful",
      );

      res.status(200).json({
        message: "success",
        data: result.user,
      });
    } catch (error) {
      logger.error(
        {
          err: error,
          username: payload.username,
        },
        "Failed user registration",
      );

      response.error(res, error, "Failed registration");
    }
  },
  async login(req: Request, res: Response) {
    /**
     #swagger.requestBody = {
     required: true,
     schema: {
     $ref: "#components/schemas/LoginRequest"}
     }
     
     */
    const payload = req.body as unknown as TLogin;
    try {
      const result = await authService.login(payload);
      const userData = getUserData(result.token);

      logger.info({ user: userData }, "Login Success");
      return res.status(200).json({
        message: "Login success",
        data: result.token,
      });
    } catch (error: any) {
      const status = error.message === "User not found" ? 403 : 400;
      logger.error(
        {
          err: error,
          username: payload.email,
        },
        "Failed user registration",
      );
      return res.status(status).json({
        message: error.message,
        data: null,
      });
    } finally {
    }
  },
  async activation(req: IReqUser, res: Response) {
    /**
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/ActivationRequest'}
    }
     */
    try {
      const { activationCode } = req.body;
      const result = await authService.activationCode(activationCode);
      logger.info(
        {
          username: result.updatedUser.username,
          isVerified: result.updatedUser.isVerified,
        },
        "User activation successful",
      );
      response.success(res, result.updatedUser, "User successfully activated");
    } catch (error) {
      logger.error(
        {
          err: error,
        },
        "User is failed activated",
      );
      response.error(res, error, "User is failed activated");
    }
  },

  async resendActivationCode(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const result = await authService.resendActivationCode(email);
      logger.info(
        { username: result.updatedUser.username },
        "Success resend activation code",
      );
      response.success(
        res,
        result.updatedUser.activationCode,
        "Success resend activation code",
      );
    } catch (error) {
      logger.error(
        {
          err: error,
          email: email,
        },
        "Failed send activation code",
      );

      response.error(res, error, "Failed send activation code");
    }
  },

  async me(req: IReqUser, res: Response) {
    /**
    #swagger.security = [{
     "bearerAuth": []
     }]
     */
    try {
      const user = req.user;
      const result = await prisma.users.findFirst({ where: { id: user?.id } });

      if (!result?.isVerified) {
        res.status(404).json({
          message: "User is not active",
          data: null,
        });
      }

      res.status(200).json({
        message: "Success get user profile",
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
