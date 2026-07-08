import { SECRET } from "./env";
import jwt from "jsonwebtoken";
import { Users } from "../generated/prisma/client";
export interface IUserToken {
  id: Users["id"];
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
