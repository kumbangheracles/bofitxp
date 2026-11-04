"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const user_service_1 = require("../services/user.service");
const pino_1 = __importDefault(require("../utils/pino"));
const jwt_1 = require("../utils/jwt");
const otpGuard_1 = require("../utils/otpGuard");
const userService = new user_service_1.UserService();
exports.default = {
    async updateUser(req, res) {
        const payload = req.body;
        const userId = req.user?.id;
        try {
            const { updatedUser } = await userService.update(payload, userId);
            const userData = updatedUser;
            const token = (0, jwt_1.generateToken)({
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
            pino_1.default.info({ user: updatedUser }, "Success update user");
            response_1.default.success(res, { updatedUser, token }, "Success update user");
        }
        catch (error) {
            pino_1.default.error({
                err: error,
                username: payload.username,
            }, "Failed update user");
            response_1.default.error(res, error, "Failed update user");
        }
    },
    async sendOtpConfirmationCode(req, res) {
        const { email } = req.body;
        const clientIp = (0, otpGuard_1.getClientIp)(req);
        try {
            await userService.sendOtpConfirmationCode(email, clientIp);
            response_1.default.success(res, null, "OTP confirmation code sent successfully");
        }
        catch (error) {
            pino_1.default.error({
                err: error,
                emailHash: email ? email.trim().toLowerCase() : null,
            }, "Failed to send OTP confirmation code");
            response_1.default.error(res, error, "Failed to send OTP confirmation code");
        }
    },
    async resendOtpConfirmationCode(req, res) {
        const { email } = req.body;
        const clientIp = (0, otpGuard_1.getClientIp)(req);
        try {
            await userService.resendOtpConfirmationCode(email, clientIp);
            response_1.default.success(res, null, "OTP confirmation code resent successfully");
        }
        catch (error) {
            pino_1.default.error({
                err: error,
                emailHash: email ? email.trim().toLowerCase() : null,
            }, "Failed to resend OTP confirmation code");
            response_1.default.error(res, error, "Failed to resend OTP confirmation code");
        }
    },
    async requestEmailChange(req, res) {
        const { email } = req.body;
        const userId = req.user?.id;
        try {
            const result = await userService.requestEmailChange(userId, email);
            response_1.default.success(res, result, "Email change OTP requested successfully");
        }
        catch (error) {
            pino_1.default.error({ err: error, userId, email }, "Failed to request email change");
            response_1.default.error(res, error, "Failed to request email change");
        }
    },
    async confirmEmailChange(req, res) {
        const { email, otp } = req.body;
        const userId = req.user?.id;
        try {
            const result = await userService.confirmEmailChange(userId, email, otp);
            const updatedUser = result.updatedUser;
            const token = (0, jwt_1.generateToken)({
                id: updatedUser.id,
                fullName: updatedUser.fullName,
                username: updatedUser.username,
                email: updatedUser.email,
                isVerified: updatedUser.isVerified,
                gender: updatedUser.gender ?? null,
                age: updatedUser.age ?? null,
                level: updatedUser.level,
                streak: updatedUser.streak,
                avatarUrl: updatedUser.avatarUrl ?? null,
                xp: updatedUser.xp,
                target_final: updatedUser.target_final ?? null,
                createdAt: updatedUser.createdAt,
                body_height: updatedUser.body_height,
                body_weight: updatedUser.body_weight,
                body_mass_index: updatedUser.body_mass_index,
            });
            response_1.default.success(res, { updatedUser, token }, "Email change confirmed successfully");
        }
        catch (error) {
            pino_1.default.error({ err: error, userId, email }, "Failed to confirm email change");
            response_1.default.error(res, error, "Failed to confirm email change");
        }
    },
    async changePassword(req, res) {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user?.id;
        try {
            const { updatedUser } = await userService.update({
                currentPassword,
                password: newPassword,
                confirmPassword,
            }, userId);
            response_1.default.success(res, { updatedUser }, "Password updated successfully");
        }
        catch (error) {
            pino_1.default.error({ err: error, userId }, "Failed to change password");
            response_1.default.error(res, error, "Failed to change password");
        }
    },
};
