import { TUpdateUser } from "../controllers/user.controller";
import { Users } from "../generated/prisma/client";
import prisma from "../utils/prisma";
import { updateUserSchema } from "../validation/user.validation";

export class UserService {
  async update(payload: TUpdateUser, id: Users["id"]) {
    if (!id) {
      throw new Error("Invalid id");
    }

    const user = prisma.users.findFirst({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }
    await updateUserSchema.validate(payload);

    const updatedUser = await prisma.users.update({
      where: { id },
      data: payload,
    });

    return { updatedUser };
  }
}
