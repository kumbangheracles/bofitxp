import { Request, Response } from "express";
import * as Yup from "yup";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";
import { registerValidateSchema } from "../validation/auth.validation";
import prisma from "../utils/prisma";
type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

export default {
  async register(req: Request, res: Response) {
    const {
      fullName,
      username,
      email,
      password,
      confirmPassword,
      phoneNumber,
    } = req.body as unknown as TRegister;

    try {
      await registerValidateSchema.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
        phoneNumber,
      });
      const hashedPassword = encrypt(password);
      const result = await prisma.user.create({
        data: { fullName, username, email, password: hashedPassword },
      });
      res.status(200).json({
        message: "Success Registration!",
        data: result,
      });
    } catch (error: any) {
      const err = error as Error;
      console.log("error validate register: ", err);
      res.status(400).json({
        message: err.message,
        data: null,
      });
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
    const { identifier, password } = req.body as unknown as TLogin;
    try {
      const userByIdentifier = await prisma.user.findFirst({
        where: {
          OR: [{ username: identifier }, { email: identifier }],
        },
      });

      // validasi identifier
      if (!userByIdentifier) {
        return res.status(403).json({
          message: "User not found",
          data: null,
        });
      }

      // validasi password
      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        return res.status(403).json({
          message: "User not found",
          data: null,
        });
      }

      const token = generateToken({
        id: userByIdentifier?.id,
      });
      res.status(200).json({
        message: "Login success",
        data: token,
      });
    } catch (error: any) {
      const err = error as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
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
      const result = await prisma.user.findUnique({ where: { id: user?.id } });

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
