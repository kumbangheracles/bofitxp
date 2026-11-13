import * as Yup from "yup";
import i18n from "@/i18n";

export const registerValidateSchema = Yup.object({
  fullName: Yup.string()
    .required(() => i18n.t("validation.fullNameRequired"))
    .min(6, () => i18n.t("validation.minChars", { count: 6 })),
  username: Yup.string()
    .required(() => i18n.t("validation.usernameRequired"))
    .min(6, () => i18n.t("validation.minChars", { count: 6 })),
  email: Yup.string()
    .email(() => i18n.t("validation.emailInvalid"))
    .required(() => i18n.t("validation.emailRequired")),
  password: Yup.string()
    .min(8, () => i18n.t("validation.passwordMin"))
    .required(() => i18n.t("validation.passwordRequired")),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], () => i18n.t("validation.passwordMismatch"))
    .required(() => i18n.t("validation.passwordRequired")),
  gender: Yup.string()
    .oneOf(["pria", "wanita"], () => i18n.t("validation.genderRequired"))
    .required(() => i18n.t("validation.genderRequired")),
}).required();

export const loginValidateSchema = Yup.object({
  email: Yup.string()
    .email(() => i18n.t("validation.emailInvalid"))
    .required(() => i18n.t("validation.emailRequired")),
  password: Yup.string().required(() => i18n.t("validation.passwordRequired")),
});

export const updateUserSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3, () => i18n.t("validation.minChars", { count: 3 }))
    .max(100)
    .notRequired(),

  username: Yup.string()
    .trim()
    .min(3, () => i18n.t("validation.minChars", { count: 3 }))
    .max(30)
    .notRequired(),

  email: Yup.string()
    .trim()
    .email(() => i18n.t("validation.emailInvalid"))
    .notRequired(),

  password: Yup.string()
    .min(8, () => i18n.t("validation.passwordMin"))
    .notRequired(),

  currentPassword: Yup.string()
    .min(8, () => i18n.t("validation.passwordMin"))
    .notRequired(),

  confirmPassword: Yup.string()
    .min(8, () => i18n.t("validation.passwordMin"))
    .notRequired(),

  gender: Yup.string()
    .oneOf(["pria", "wanita"], () => i18n.t("validation.genderRequired"))
    .notRequired(),

  age: Yup.number()
    .typeError(() => i18n.t("validation.minChars", { count: 1 }))
    .integer()
    .min(0)
    .max(120)
    .notRequired(),

  target_final: Yup.string()
    .oneOf(
      ["weight_loss", "muscle_gain", "maintain_fitness", "endurance"],
      () => i18n.t("error.somethingWentWrong"),
    )
    .notRequired(),

  avatarUrl: Yup.string().url().nullable().notRequired(),

  body_weight: Yup.number()
    .typeError(() => i18n.t("validation.minChars", { count: 1 }))
    .positive()
    .max(500)
    .notRequired(),

  body_height: Yup.number()
    .typeError(() => i18n.t("validation.minChars", { count: 1 }))
    .integer()
    .positive()
    .max(300)
    .notRequired(),
});

export type TUpdateUser = Yup.InferType<typeof updateUserSchema>;
export type TRegister = Yup.InferType<typeof registerValidateSchema>;
export type TLogin = Yup.InferType<typeof loginValidateSchema>;
export const loginValidation = Yup.object({});
