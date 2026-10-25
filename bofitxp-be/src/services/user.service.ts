import { TUpdateUser } from "../controllers/user.controller";
import { Users } from "../generated/prisma/client";
import helpers from "../helpers";
import { EMAIL_SMTP_USER } from "../utils/env";
import prisma from "../utils/prisma";
import {
  AppDependencyError,
  AppRateLimitError,
  AppValidationError,
  isValidEmail,
  normalizeEmail,
  reserveEmailOtpSend,
} from "../utils/otpGuard";
import { generateVerificationCode } from "../utils/verificationCode";
import { updateUserSchema } from "../validation/user.validation";
import { renderMailHtml, sendMail } from "./mailer.service";

export class UserService {
  async update(payload: TUpdateUser, id: Users["id"]) {
    if (!id) {
      throw new Error("Invalid id");
    }

    const user = await prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await updateUserSchema.validate(payload);

    const weight = payload.body_weight ?? user.body_weight;
    const height = payload.body_height ?? user.body_height;

    const data = {
      ...payload,
    };

    if (weight > 0 && height > 0) {
      const heightInMeter = height / 100;

      data.body_mass_index = weight / heightInMeter ** 2;
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data,
    });

    return { updatedUser };
  }

  async sendOtpConfirmationCode(email: string, clientIp?: string) {
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      throw new AppValidationError("Invalid email format");
    }

    if (!clientIp) {
      throw new AppValidationError("Unable to determine client IP safely");
    }

    try {
      await reserveEmailOtpSend(normalizedEmail);
    } catch (error) {
      if (
        error instanceof AppRateLimitError ||
        error instanceof AppDependencyError
      ) {
        throw error;
      }
      throw new AppDependencyError("OTP rate limiter is unavailable");
    }

    const user = await prisma.users.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new Error("Email not found");
    }

    if (!user.isVerified) {
      throw new Error("User is not verified yet");
    }

    const { expireTime } = helpers();
    const otpConfirmationCode = generateVerificationCode();

    await prisma.users.update({
      where: { id: user.id },
      data: {
        otpConfirmationCode,
        otpConfirmationExpireAt: expireTime,
      },
    });

    const contentMail = await renderMailHtml("confirmation-email.ejs", {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      otpConfirmationCode,
    });

    try {
      await sendMail({
        from: EMAIL_SMTP_USER,
        to: user.email,
        subject: "Account Confirmation",
        html: contentMail,
      });
    } catch (error) {
      // Keep the Redis reservation and quota consumption intact to avoid race conditions.
      throw new AppDependencyError("OTP email delivery failed");
    }
  }

  async resendOtpConfirmationCode(email: string, clientIp?: string) {
    return this.sendOtpConfirmationCode(email, clientIp);
  }
}
