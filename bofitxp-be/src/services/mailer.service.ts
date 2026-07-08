import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";
import {
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_PASS,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_SECURE,
  EMAIL_SMTP_SERVICE_NAME,
  EMAIL_SMTP_USER,
} from "../utils/env";
import ejs from "ejs";
import path from "path";
const transporter = nodemailer.createTransport({
  host: EMAIL_SMTP_HOST,
  port: EMAIL_SMTP_PORT,
  secure: EMAIL_SMTP_SECURE,
  service: EMAIL_SMTP_SERVICE_NAME,
  auth: {
    user: EMAIL_SMTP_USER,
    pass: EMAIL_SMTP_PASS,
  },
  requireTLS: true,
});

export interface ISendMail {
  to: string;
  subject: string;
  html: string;
  from: string;
}

export const sendMail = async ({ ...mailParams }: ISendMail) => {
  const result = await transporter.sendMail({
    ...mailParams,
  });
  return result;
};

export const renderMailHtml = async (
  template: string,
  data: any,
): Promise<string> => {
  const content = await ejs.renderFile(
    path.join(__dirname, "../utils/templates", template),
    data,
  );
  return content as string;
};

export const sendEmailVerification = async (email: string, code: string) => {
  await transporter.sendMail({
    from: `"BofitXp " <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code",
    html: `<p>Hello! Here's your verification code: <b>${code}</b></p>`,
  });
};

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
