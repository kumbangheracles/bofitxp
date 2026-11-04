"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const helpers_1 = __importDefault(require("../helpers"));
const env_1 = require("../utils/env");
const encryption_1 = require("../utils/encryption");
const prisma_1 = __importDefault(require("../utils/prisma"));
const otpGuard_1 = require("../utils/otpGuard");
const verificationCode_1 = require("../utils/verificationCode");
const user_validation_1 = require("../validation/user.validation");
const mailer_service_1 = require("./mailer.service");
class UserService {
    async update(payload, id) {
        if (!id) {
            throw new Error("Invalid id");
        }
        const user = await prisma_1.default.users.findUnique({
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
            if ((0, encryption_1.encrypt)(payload.currentPassword) !== user.password) {
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
            sanitizedPayload.password = (0, encryption_1.encrypt)(sanitizedPayload.password);
        }
        if (sanitizedPayload.email && sanitizedPayload.email !== user.email) {
            const normalizedEmail = (0, otpGuard_1.normalizeEmail)(sanitizedPayload.email);
            if (!(0, otpGuard_1.isValidEmail)(normalizedEmail)) {
                throw new otpGuard_1.AppValidationError("Invalid email format");
            }
            const emailOwner = await prisma_1.default.users.findUnique({
                where: { email: normalizedEmail },
            });
            if (emailOwner && emailOwner.id !== user.id) {
                throw new Error("Email is already in use");
            }
            sanitizedPayload.email = normalizedEmail;
            sanitizedPayload.isVerified = false;
        }
        await user_validation_1.updateUserSchema.validate(sanitizedPayload);
        const weight = sanitizedPayload.body_weight ?? user.body_weight;
        const height = sanitizedPayload.body_height ?? user.body_height;
        const data = {
            ...sanitizedPayload,
        };
        if (weight > 0 && height > 0) {
            const heightInMeter = height / 100;
            data.body_mass_index = weight / heightInMeter ** 2;
        }
        const updatedUser = await prisma_1.default.users.update({
            where: { id },
            data,
        });
        return { updatedUser };
    }
    async requestEmailChange(userId, newEmail) {
        if (!userId) {
            throw new Error("Invalid id");
        }
        const user = await prisma_1.default.users.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const normalizedEmail = (0, otpGuard_1.normalizeEmail)(newEmail);
        if (!(0, otpGuard_1.isValidEmail)(normalizedEmail)) {
            throw new otpGuard_1.AppValidationError("Invalid email format");
        }
        const existingUser = await prisma_1.default.users.findUnique({
            where: { email: normalizedEmail },
        });
        if (existingUser && existingUser.id !== user.id) {
            throw new Error("Email is already in use");
        }
        const otpCode = (0, verificationCode_1.generateVerificationCode)();
        const expireTime = new Date(Date.now() + 10 * 60 * 1000);
        const updatedUser = await prisma_1.default.users.update({
            where: { id: user.id },
            data: {
                otpConfirmationCode: otpCode,
                otpConfirmationExpireAt: expireTime,
            },
        });
        const contentMail = await (0, mailer_service_1.renderMailHtml)("confirmation-email.ejs", {
            username: user.username,
            fullName: user.fullName,
            email: normalizedEmail,
            createdAt: user.createdAt,
            otpConfirmationCode: otpCode,
        });
        await (0, mailer_service_1.sendMail)({
            from: env_1.EMAIL_SMTP_USER,
            to: normalizedEmail,
            subject: "Verify your new email address",
            html: contentMail,
        });
        return {
            pendingEmail: normalizedEmail,
            updatedUser,
        };
    }
    async confirmEmailChange(userId, newEmail, otpCode) {
        if (!userId) {
            throw new Error("Invalid id");
        }
        const user = await prisma_1.default.users.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const normalizedEmail = (0, otpGuard_1.normalizeEmail)(newEmail);
        if (!user.otpConfirmationCode || user.otpConfirmationCode !== otpCode) {
            throw new Error("Invalid or expired OTP confirmation code");
        }
        if (!user.otpConfirmationExpireAt ||
            user.otpConfirmationExpireAt < new Date()) {
            throw new Error("OTP confirmation code has expired");
        }
        const emailOwner = await prisma_1.default.users.findUnique({
            where: { email: normalizedEmail },
        });
        if (emailOwner && emailOwner.id !== user.id) {
            throw new Error("Email is already in use");
        }
        const updatedUser = await prisma_1.default.users.update({
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
    async sendOtpConfirmationCode(email, clientIp) {
        const normalizedEmail = (0, otpGuard_1.normalizeEmail)(email);
        if (!(0, otpGuard_1.isValidEmail)(normalizedEmail)) {
            throw new otpGuard_1.AppValidationError("Invalid email format");
        }
        if (!clientIp) {
            throw new otpGuard_1.AppValidationError("Unable to determine client IP safely");
        }
        try {
            await (0, otpGuard_1.reserveEmailOtpSend)(normalizedEmail);
        }
        catch (error) {
            if (error instanceof otpGuard_1.AppRateLimitError ||
                error instanceof otpGuard_1.AppDependencyError) {
                throw error;
            }
            throw new otpGuard_1.AppDependencyError("OTP rate limiter is unavailable");
        }
        const user = await prisma_1.default.users.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user) {
            throw new Error("Email not found");
        }
        if (!user.isVerified) {
            throw new Error("User is not verified yet");
        }
        const { expireTime } = (0, helpers_1.default)();
        const otpConfirmationCode = (0, verificationCode_1.generateVerificationCode)();
        await prisma_1.default.users.update({
            where: { id: user.id },
            data: {
                otpConfirmationCode,
                otpConfirmationExpireAt: expireTime,
            },
        });
        const contentMail = await (0, mailer_service_1.renderMailHtml)("confirmation-email.ejs", {
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
            otpConfirmationCode,
        });
        try {
            await (0, mailer_service_1.sendMail)({
                from: env_1.EMAIL_SMTP_USER,
                to: user.email,
                subject: "Account Confirmation",
                html: contentMail,
            });
        }
        catch (error) {
            // Keep the Redis reservation and quota consumption intact to avoid race conditions.
            throw new otpGuard_1.AppDependencyError("OTP email delivery failed");
        }
    }
    async resendOtpConfirmationCode(email, clientIp) {
        return this.sendOtpConfirmationCode(email, clientIp);
    }
}
exports.UserService = UserService;
