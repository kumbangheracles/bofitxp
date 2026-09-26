import * as Yup from "yup";

export const registerValidateSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name must be filled.")
    .min(6, "Consist of at least 6 characters!."),
  username: Yup.string()
    .required("Username must be filled.")
    .min(6, "Consist of at least 6 characters!."),
  email: Yup.string()
    .email("Email format not valid")
    .required("Please input your email"),
  password: Yup.string()
    .min(8, "Minimal 8 Characters")
    .required("Please input your password"),
  confirmPassword: Yup.string()
    // Catatan: null di Yup v1 ke atas biasanya ditulis Yup.ref("password") saja
    .oneOf([Yup.ref("password")], "Password not match")
    .required("Please input your password"),
  // activationCode: Yup.string() // Pastikan semua field dari TRegister ada di skema
  //   .default(""),
}).required(); // <-- Tambahkan .required() di ujung objek schema

export const loginValidateSchema = Yup.object({
  email: Yup.string()
    .email("Email format not valid")
    .required("Please input your email"),
  password: Yup.string().required("Please input your password"),
});

export const updateUserSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must be at most 100 characters")
    .notRequired(),

  username: Yup.string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .notRequired(),

  email: Yup.string().trim().email("Invalid email format").notRequired(),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .notRequired(),

  avatarUrl: Yup.string().url("Invalid avatar URL").nullable().notRequired(),

  body_weight: Yup.number()
    .typeError("Body weight must be a number")
    .positive("Body weight must be greater than 0")
    .max(500, "Body weight is too high")
    .notRequired(),

  body_height: Yup.number()
    .typeError("Body height must be a number")
    .integer("Body height must be an integer")
    .positive("Body height must be greater than 0")
    .max(300, "Body height is too high")
    .notRequired(),
});

export type TUpdateUser = Yup.InferType<typeof updateUserSchema>;
export type TRegister = Yup.InferType<typeof registerValidateSchema>;
export type TLogin = Yup.InferType<typeof loginValidateSchema>;
export const loginValidation = Yup.object({});
