import { SECRET } from "./env";
import jwt from "jsonwebtoken";
import { User } from "../generated/prisma/client";
export interface IUserToken extends Omit<
  User,
  "password" | "email" | "fullName" | "username"
> {
  id: string;
}

export const generateToken = (user: IUserToken): string => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as IUserToken;
  return user;
};
