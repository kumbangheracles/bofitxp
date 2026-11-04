"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_output_json_1 = __importDefault(require("../docs/swagger_output.json"));
describe("Swagger docs coverage", () => {
    const expectedPaths = [
        "/auth/register",
        "/auth/login",
        "/auth/activation",
        "/auth/resend-activation",
        "/auth/me",
        "/user/send-otp-confirmation-code",
        "/user/resend-otp-confirmation-code",
        "/user/request-email-change",
        "/user/confirm-email-change",
        "/user/change-password",
        "/user-update",
        "/user-quests/generate",
        "/user-quests",
        "/user-quests/{userQuestId}/{questId}",
    ];
    test.each(expectedPaths)("docs harus mencakup endpoint %s", (path) => {
        expect(swagger_output_json_1.default.paths).toHaveProperty(path);
    });
});
