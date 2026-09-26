import { TUpdateUser } from "../controllers/user.controller";
import { Users } from "../generated/prisma/client";
import prisma from "../utils/prisma";
import { updateUserSchema } from "../validation/user.validation";

export class UserService {
  async update(payload: TUpdateUser, id: Users["id"]) {
    if (!id) {
      throw new Error("Invalid id");
    }

    const user = await prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await updateUserSchema.validate(payload);

    const weight = payload.body_weight ?? user.body_weight;
    const height = payload.body_height ?? user.body_height;

    const data = {
      ...payload,
    };

    if (weight > 0 && height > 0) {
      const heightInMeter = height / 100;

      data.body_mass_index = weight / heightInMeter ** 2;
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data,
    });

    return { updatedUser };
  }
}
