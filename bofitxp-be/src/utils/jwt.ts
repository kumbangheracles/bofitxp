import { SECRET } from "./env";
import jwt from "jsonwebtoken";
import { Users } from "../generated/prisma/client";
export interface IUserToken {
  id: Users["id"];
  fullName: Users["fullName"];
  username: Users["username"];
  email: Users["email"];
  isVerified: Users["isVerified"];
  body_mass_index: Users["body_mass_index"];
  body_weight: Users["body_weight"];
  body_height: Users["body_height"];
  level: Users["level"];
  streak: Users["streak"];
  avatarUrl: Users["avatarUrl"];
  xp: Users["xp"];
  createdAt: Users["createdAt"];
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
