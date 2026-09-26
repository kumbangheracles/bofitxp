import instance from "@/utils/axios/instance";
import { TUpdateUser } from "@/utils/validation/user.validation";
export class UserService {
  async updateUser(payload: TUpdateUser) {
    const result = await instance.patch("/user-update", payload);

    return result;
  }
}
