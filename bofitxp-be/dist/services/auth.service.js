"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const mailer_service_1 = require("./mailer.service");
const env_1 = require("../utils/env");
const encryption_1 = require("../utils/encryption");
const verificationCode_1 = require("../utils/verificationCode");
const jwt_1 = require("../utils/jwt");
const auth_validation_1 = require("../validation/auth.validation");
const helpers_1 = __importDefault(require("../helpers"));
class AuthService {
    async login(payload) {
        const { email, password } = payload;
        const user = await prisma_1.default.users.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error("Email atau password salah");
        }
        const isPasswordValid = (0, encryption_1.encrypt)(password) === user.password;
        if (!isPasswordValid) {
            throw new Error("Email atau password salah");
        }
        const profileUser = user;
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            gender: profileUser.gender ?? null,
            age: profileUser.age ?? null,
            level: user.level,
            streak: user.streak,
            avatarUrl: user.avatarUrl,
            xp: user.xp,
            target_final: profileUser.target_final ?? null,
            createdAt: user.createdAt,
            body_height: user.body_height,
            body_weight: user.body_weight,
            body_mass_index: user.body_mass_index,
        });
        return { token };
    }
    async register(payload) {
        const { expireTime } = (0, helpers_1.default)();
        const activationCode = (0, verificationCode_1.generateVerificationCode)();
        await auth_validation_1.registerValidateSchema.validate(payload);
        // 5 minute
        const user = await prisma_1.default.users.create({
            data: {
                fullName: payload.fullName,
                username: payload.username,
                email: payload.email,
                password: (0, encryption_1.encrypt)(payload.password),
                activationCode,
                level: 0,
                streak: 0,
                xp: 0,
                expireAt: expireTime,
                isVerified: false,
                gender: payload.gender,
            },
        });
        const contentMail = await (0, mailer_service_1.renderMailHtml)("registration-success.ejs", {
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
            activationCode: user.activationCode,
        });
        await (0, mailer_service_1.sendMail)({
            from: env_1.EMAIL_SMTP_USER,
            to: user.email,
            subject: "Account Verificaton",
            html: contentMail,
        });
        return { user };
    }
    async activationCode(activationCode) {
        const user = await prisma_1.default.users.findFirst({
            where: { activationCode },
        });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.isVerified) {
            throw new Error("User already activated");
        }
        const updatedUser = await prisma_1.default.users.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                activationCode: null,
                expireAt: null,
            },
        });
        return { updatedUser };
    }
    async resendActivationCode(email) {
        const user = await prisma_1.default.users.findFirst({
            where: { email },
        });
        const { expireTime } = (0, helpers_1.default)();
        if (!user) {
            throw new Error("User not found");
        }
        if (user.expireAt === null) {
            throw new Error("User not found, please sign up again");
        }
        if (user.isVerified) {
            throw new Error("User already verified");
        }
        const activationCode = (0, verificationCode_1.generateVerificationCode)();
        const updatedUser = await prisma_1.default.users.update({
            where: { id: user.id },
            data: {
                activationCode: activationCode,
                expireAt: expireTime,
            },
        });
        const contentMail = await (0, mailer_service_1.renderMailHtml)("registration-success.ejs", {
            username: updatedUser.username,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            createdAt: updatedUser.createdAt,
            activationCode: updatedUser.activationCode,
        });
        await (0, mailer_service_1.sendMail)({
            from: env_1.EMAIL_SMTP_USER,
            to: updatedUser.email,
            subject: "Account Verificaton",
            html: contentMail,
        });
        return { updatedUser };
    }
}
exports.AuthService = AuthService;
