import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { Users } from "../generated/prisma/client";
import response from "../utils/response";
import { UserService } from "../services/user.service";

export type TUpdateUser = Omit<Users, "password" | "activationCode" | "id">;
const userService = new UserService();
export default {
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payload = req.body as unknown as TUpdateUser;

      const { updatedUser } = await userService.update(payload, id);

      response.success(res, updatedUser, "Success update user");
    } catch (error) {
      response.error(res, error, "Failed update user");
    }
  },
};
