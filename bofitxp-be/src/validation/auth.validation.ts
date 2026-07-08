import * as Yup from "yup";
import { Users } from "../generated/prisma/client";
export interface UserDTO extends Users {}
export const registerValidateSchema = Yup.object<UserDTO>({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Password not match"),
});

export const loginValidation = Yup.object({});
