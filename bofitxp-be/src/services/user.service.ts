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

    let bmi: number;

    if (payload.body_height !== null && payload.body_weight !== null) {
      bmi = payload.body_weight / payload.body_height ** 2;
      const updatedUser = await prisma.users.update({
        where: { id },
        data: { ...payload, body_mass_index: bmi },
      });

      return { updatedUser };
    } else {
      const updatedUser = await prisma.users.update({
        where: { id },
        data: { ...payload },
      });

      return { updatedUser };
    }
  }
}
