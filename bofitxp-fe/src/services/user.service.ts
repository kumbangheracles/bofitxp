import instance from "@/utils/axios/instance";
import { TUpdateUser } from "@/utils/validation/user.validation";
export class UserService {
  async updateUser(payload: TUpdateUser) {
    const result = await instance.patch("/user-update", payload);

    return result;
  }

  async requestEmailChange(email: string) {
    const result = await instance.post("/user/request-email-change", { email });

    return result;
  }

  async confirmEmailChange(payload: { email: string; otp: string }) {
    const result = await instance.post("/user/confirm-email-change", payload);

    return result;
  }

  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    const result = await instance.patch("/user/change-password", payload);

    return result;
  }
}
