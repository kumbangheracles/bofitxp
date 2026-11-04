"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../utils/prisma"));
const response_1 = __importDefault(require("../utils/response"));
const auth_service_1 = require("../services/auth.service");
const pino_1 = __importDefault(require("../utils/pino"));
const jwt_1 = require("../utils/jwt");
const authService = new auth_service_1.AuthService();
exports.default = {
    async register(req, res) {
        const payload = req.body;
        pino_1.default.info({ username: payload.username }, "Start user registration");
        try {
            const result = await authService.register(payload);
            pino_1.default.info({ username: payload.username }, "User registration successful");
            res.status(200).json({
                message: "success",
                data: result.user,
            });
        }
        catch (error) {
            pino_1.default.error({
                err: error,
                username: payload.username,
            }, "Failed user registration");
            response_1.default.error(res, error, "Failed registration");
        }
    },
    async login(req, res) {
        const payload = req.body;
        try {
            const result = await authService.login(payload);
            const userData = (0, jwt_1.getUserData)(result.token);
            pino_1.default.info({ user: userData }, "Login Success");
            return res.status(200).json({
                message: "Login success",
                data: result.token,
            });
        }
        catch (error) {
            const status = error.message === "User not found" ? 403 : 400;
            pino_1.default.error({
                err: error,
                username: payload.email,
            }, "Failed user registration");
            return res.status(status).json({
                message: error.message,
                data: null,
            });
        }
        finally {
        }
    },
    async activation(req, res) {
        try {
            const { activationCode } = req.body;
            const result = await authService.activationCode(activationCode);
            pino_1.default.info({
                username: result.updatedUser.username,
                isVerified: result.updatedUser.isVerified,
            }, "User activation successful");
            response_1.default.success(res, result.updatedUser, "User successfully activated");
        }
        catch (error) {
            pino_1.default.error({
                err: error,
            }, "User is failed activated");
            response_1.default.error(res, error, "User is failed activated");
        }
    },
    async resendActivationCode(req, res) {
        const { email } = req.body;
        try {
            const result = await authService.resendActivationCode(email);
            pino_1.default.info({ username: result.updatedUser.username }, "Success resend activation code");
            response_1.default.success(res, result.updatedUser.activationCode, "Success resend activation code");
        }
        catch (error) {
            pino_1.default.error({
                err: error,
                email: email,
            }, "Failed send activation code");
            response_1.default.error(res, error, "Failed send activation code");
        }
    },
    async me(req, res) {
        try {
            const user = req.user;
            const result = await prisma_1.default.users.findFirst({ where: { id: user?.id } });
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
        }
        catch (error) {
            const err = error;
            res.status(400).json({
                message: err.message,
                data: null,
            });
        }
    },
};
