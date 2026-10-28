import swaggerOutput from "../docs/swagger_output.json";

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
    expect(swaggerOutput.paths).toHaveProperty(path);
  });
});
