"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        version: "v0.0.1",
        title: "BofitXP API Documentation",
        description: "Dokumentasi API untuk backend BofitXP.",
    },
    tags: [
        { name: "Auth", description: "Autentikasi dan akun user" },
        { name: "User", description: "Pengelolaan profil dan email user" },
        { name: "User Quests", description: "Quest dan progress user" },
    ],
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local Server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            RegisterRequest: {
                type: "object",
                required: [
                    "fullName",
                    "username",
                    "email",
                    "password",
                    "confirmPassword",
                    "gender",
                ],
                properties: {
                    fullName: { type: "string", example: "Ahmad Herkal" },
                    username: { type: "string", example: "ahmadherkal" },
                    email: { type: "string", example: "user@example.com" },
                    password: { type: "string", example: "Password123!" },
                    confirmPassword: { type: "string", example: "Password123!" },
                    gender: { type: "string", enum: ["pria", "wanita"] },
                },
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", example: "user@example.com" },
                    password: { type: "string", example: "Password123!" },
                },
            },
            ActivationRequest: {
                type: "object",
                required: ["activationCode"],
                properties: {
                    activationCode: { type: "string", example: "ABC123" },
                },
            },
            ResendActivationRequest: {
                type: "object",
                required: ["email"],
                properties: {
                    email: { type: "string", example: "user@example.com" },
                },
            },
            OtpRequest: {
                type: "object",
                required: ["email"],
                properties: {
                    email: { type: "string", example: "user@example.com" },
                },
            },
            EmailChangeRequest: {
                type: "object",
                required: ["email"],
                properties: {
                    email: { type: "string", example: "newemail@example.com" },
                },
            },
            ConfirmEmailChangeRequest: {
                type: "object",
                required: ["email", "otp"],
                properties: {
                    email: { type: "string", example: "newemail@example.com" },
                    otp: { type: "string", example: "123456" },
                },
            },
            ChangePasswordRequest: {
                type: "object",
                required: ["currentPassword", "newPassword", "confirmPassword"],
                properties: {
                    currentPassword: { type: "string", example: "OldPassword123!" },
                    newPassword: { type: "string", example: "NewPassword123!" },
                    confirmPassword: { type: "string", example: "NewPassword123!" },
                },
            },
            UserUpdateRequest: {
                type: "object",
                properties: {
                    fullName: { type: "string", example: "Ahmad Herkal" },
                    username: { type: "string", example: "ahmadherkal" },
                    email: { type: "string", example: "user@example.com" },
                    gender: { type: "string", enum: ["pria", "wanita"] },
                    age: { type: "number", example: 22 },
                    body_weight: { type: "number", example: 70 },
                    body_height: { type: "number", example: 170 },
                    target_final: { type: "string", example: "weight_loss" },
                    password: { type: "string", example: "Password123!" },
                    currentPassword: { type: "string", example: "OldPassword123!" },
                    confirmPassword: { type: "string", example: "NewPassword123!" },
                },
            },
        },
    },
};
const outputFile = path_1.default.resolve(__dirname, "./swagger_output.json");
const endpointsFiles = [path_1.default.resolve(__dirname, "../routes/api.ts")];
(0, swagger_autogen_1.default)({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)
    .then(() => {
    const generated = JSON.parse(fs_1.default.readFileSync(outputFile, "utf-8"));
    Object.entries(generated.paths ?? {}).forEach(([route, methods]) => {
        const tagName = route.startsWith("/auth")
            ? "Auth"
            : route.startsWith("/user-quests")
                ? "User Quests"
                : route.startsWith("/user")
                    ? "User"
                    : "Default";
        Object.values(methods).forEach((operation) => {
            operation.tags = [tagName];
        });
    });
    fs_1.default.writeFileSync(outputFile, JSON.stringify(generated, null, 2));
})
    .catch((error) => {
    console.error("Swagger generation failed:", error);
    process.exit(1);
});
