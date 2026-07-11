import prisma from "../utils/prisma";
import { renderMailHtml, sendMail } from "./mailer.service";
import { TRegister } from "../controllers/auth.controller";
import { EMAIL_SMTP_USER, EXPIRE_TTL_MINUTE } from "../utils/env";
import { encrypt } from "../utils/encryption";
import { generateVerificationCode } from "../utils/verificationCode";
import { Users } from "../generated/prisma/client";
import { generateToken } from "../utils/jwt";
import { registerValidateSchema } from "../validation/auth.validation";
import helpers from "../helpers";

type RegisterDTO = Omit<TRegister, "confirmPassword">;
type TLogin = {
  email: string;
  password: string;
};

export class AuthService {
  async login(payload: TLogin) {
    const { email, password } = payload;

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("Email atau password salah");
    }

    const isPasswordValid = encrypt(password) === user.password;

    if (!isPasswordValid) {
      throw new Error("Email atau password salah");
    }

    const token = generateToken({ id: user.id });

    return { token };
  }

  async register(payload: RegisterDTO) {
    const { expireTime } = helpers();
    const activationCode = generateVerificationCode();
    await registerValidateSchema.validate(payload);
    // 5 minute
    const user = await prisma.users.create({
      data: {
        fullName: payload.fullName,
        username: payload.username,
        email: payload.email,
        password: encrypt(payload.password),
        activationCode,
        level: 0,
        streak: 0,
        xp: 0,
        expireAt: expireTime,
        isVerified: false,
      },
    });

    const contentMail = await renderMailHtml("registration-success.ejs", {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      activationCode: user.activationCode,
    });

    await sendMail({
      from: EMAIL_SMTP_USER,
      to: user.email,
      subject: "Account Verificaton",
      html: contentMail,
    });

    return { user };
  }

  async activationCode(activationCode: Users["activationCode"]) {
    const user = await prisma.users.findFirst({
      where: { activationCode },
    });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isVerified) {
      throw new Error("User already activated");
    }

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        activationCode: null,
        expireAt: null,
      },
    });

    return { updatedUser };
  }

  async resendActivationCode(email: string) {
    const user = await prisma.users.findFirst({
      where: { email },
    });
    const { expireTime } = helpers();

    if (!user) {
      throw new Error("User not found");
    }

    if (user.expireAt === null) {
      throw new Error("User not found, please sign up again");
    }

    if (user.isVerified) {
      throw new Error("User already verified");
    }

    const activationCode = generateVerificationCode();

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        activationCode: activationCode,
        expireAt: expireTime,
      },
    });
    const contentMail = await renderMailHtml("registration-success.ejs", {
      username: updatedUser.username,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      activationCode: updatedUser.activationCode,
    });

    await sendMail({
      from: EMAIL_SMTP_USER,
      to: updatedUser.email,
      subject: "Account Verificaton",
      html: contentMail,
    });

    return { updatedUser };
  }

  async me(payload: Users) {}
}
