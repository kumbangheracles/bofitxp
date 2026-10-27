import { TUpdateUser } from "../controllers/user.controller";
import { Users } from "../generated/prisma/client";
import helpers from "../helpers";
import { EMAIL_SMTP_USER } from "../utils/env";
import { encrypt } from "../utils/encryption";
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

    const sanitizedPayload = { ...payload };
    delete sanitizedPayload.currentPassword;
    delete sanitizedPayload.confirmPassword;

    if (sanitizedPayload.password) {
      if (!payload.currentPassword) {
        throw new Error("Current password is required");
      }

      if (encrypt(payload.currentPassword) !== user.password) {
        throw new Error("Current password is invalid");
      }

      if (!payload.confirmPassword) {
        throw new Error("Confirm password is required");
      }

      if (payload.confirmPassword !== sanitizedPayload.password) {
        throw new Error("Password confirmation does not match");
      }

      if (sanitizedPayload.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      sanitizedPayload.password = encrypt(sanitizedPayload.password);
    }

    if (sanitizedPayload.email && sanitizedPayload.email !== user.email) {
      const normalizedEmail = normalizeEmail(sanitizedPayload.email);

      if (!isValidEmail(normalizedEmail)) {
        throw new AppValidationError("Invalid email format");
      }

      const emailOwner = await prisma.users.findUnique({
        where: { email: normalizedEmail },
      });

      if (emailOwner && emailOwner.id !== user.id) {
        throw new Error("Email is already in use");
      }

      sanitizedPayload.email = normalizedEmail;
      sanitizedPayload.isVerified = false;
    }

    await updateUserSchema.validate(sanitizedPayload);

    const weight = sanitizedPayload.body_weight ?? user.body_weight;
    const height = sanitizedPayload.body_height ?? user.body_height;

    const data = {
      ...sanitizedPayload,
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

  async requestEmailChange(userId: Users["id"], newEmail: string) {
    if (!userId) {
      throw new Error("Invalid id");
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const normalizedEmail = normalizeEmail(newEmail);
    if (!isValidEmail(normalizedEmail)) {
      throw new AppValidationError("Invalid email format");
    }

    const existingUser = await prisma.users.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser && existingUser.id !== user.id) {
      throw new Error("Email is already in use");
    }

    const otpCode = generateVerificationCode();
    const expireTime = new Date(Date.now() + 10 * 60 * 1000);

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        otpConfirmationCode: otpCode,
        otpConfirmationExpireAt: expireTime,
      },
    });

    const contentMail = await renderMailHtml("confirmation-email.ejs", {
      username: user.username,
      fullName: user.fullName,
      email: normalizedEmail,
      createdAt: user.createdAt,
      otpConfirmationCode: otpCode,
    });

    await sendMail({
      from: EMAIL_SMTP_USER,
      to: normalizedEmail,
      subject: "Verify your new email address",
      html: contentMail,
    });

    return {
      pendingEmail: normalizedEmail,
      updatedUser,
    };
  }

  async confirmEmailChange(
    userId: Users["id"],
    newEmail: string,
    otpCode: string,
  ) {
    if (!userId) {
      throw new Error("Invalid id");
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const normalizedEmail = normalizeEmail(newEmail);
    if (!user.otpConfirmationCode || user.otpConfirmationCode !== otpCode) {
      throw new Error("Invalid or expired OTP confirmation code");
    }

    if (
      !user.otpConfirmationExpireAt ||
      user.otpConfirmationExpireAt < new Date()
    ) {
      throw new Error("OTP confirmation code has expired");
    }

    const emailOwner = await prisma.users.findUnique({
      where: { email: normalizedEmail },
    });

    if (emailOwner && emailOwner.id !== user.id) {
      throw new Error("Email is already in use");
    }

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        email: normalizedEmail,
        isVerified: false,
        otpConfirmationCode: null,
        otpConfirmationExpireAt: null,
      },
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
