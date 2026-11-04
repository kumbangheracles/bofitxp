"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailVerification = exports.renderMailHtml = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../utils/env");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const transporter = nodemailer_1.default.createTransport({
    host: env_1.EMAIL_SMTP_HOST,
    port: env_1.EMAIL_SMTP_PORT,
    secure: env_1.EMAIL_SMTP_SECURE,
    service: env_1.EMAIL_SMTP_SERVICE_NAME,
    auth: {
        user: env_1.EMAIL_SMTP_USER,
        pass: env_1.EMAIL_SMTP_PASS,
    },
    requireTLS: true,
});
const sendMail = async ({ ...mailParams }) => {
    const result = await transporter.sendMail({
        ...mailParams,
    });
    return result;
};
exports.sendMail = sendMail;
const renderMailHtml = async (template, data) => {
    const content = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../utils/templates", template), data);
    return content;
};
exports.renderMailHtml = renderMailHtml;
const sendEmailVerification = async (email, code) => {
    await transporter.sendMail({
        from: `"BofitXp " <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Verification Code",
        html: `<p>Hello! Here's your verification code: <b>${code}</b></p>`,
    });
};
exports.sendEmailVerification = sendEmailVerification;
// UserSchema.post("save", async function (doc, next) {
//   try {
//     const user = doc;
//     console.log("Email sended to: ", user.email);
//     const contentMail = await renderMailHtml("registration-success.ejs", {
//       username: user.username,
//       fullName: user.fullName,
//       email: user.email,
//       createdAt: user.createdAt,
//       activationCode: user.activationCode,
//     });
//     console.log("Content Email: ", contentMail);
//     await sendMail({
//       from: EMAIL_SMTP_USER,
//       to: user.email,
//       subject: "Aktivasi Akun Anda",
//       html: contentMail,
//     });
//   } catch (error) {
//     console.log("Error:", error);
//   } finally {
//     next();
//   }
// });
