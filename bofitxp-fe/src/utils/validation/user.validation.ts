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

export type TRegister = Yup.InferType<typeof registerValidateSchema>;
export type TLogin = Yup.InferType<typeof loginValidateSchema>;
export const loginValidation = Yup.object({});
