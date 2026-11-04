import * as yup from "yup";
import { Users } from "../generated/prisma/client";

export type TUpdateUser = Partial<
  Omit<Users, "password" | "activationCode" | "id">
> & {
  password?: string;
  currentPassword?: string;
  confirmPassword?: string;
};

export interface UserDTO extends Users {}

export const updateUserSchema = yup.object<TUpdateUser>({
  fullName: yup.string().min(3).optional(),
  username: yup.string().min(3).max(30).optional(),
  email: yup.string().email().optional(),
  password: yup.string().min(8).optional(),
  currentPassword: yup.string().min(8).optional(),
  confirmPassword: yup.string().min(8).optional(),
  avatarUrl: yup.string().optional(),
  level: yup.number().integer().min(1).optional(),
  streak: yup.number().integer().min(0).optional(),
  xp: yup.number().integer().min(0).optional(),
});
