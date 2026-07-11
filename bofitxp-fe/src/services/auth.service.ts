import { UserProps } from "@/types/user.type";
import instance from "@/utils/axios/instance";
import { TLogin, TRegister } from "@/utils/validation/user.validation";
export class AuthService {
  async register(payload: TRegister) {
    const result = await instance.post("/auth/register", payload);

    return result;
  }

  async login(payload: TLogin) {
    const result = await instance.post("/auth/login", payload);

    return result;
  }

  async activationCode(payload: UserProps["activationCode"]) {
    const result = await instance.post("/auth/activation", {
      activationCode: payload,
    });

    return result;
  }

  async resendActivationCode(payload: UserProps["email"]) {
    const result = await instance.post("/auth/resend-activation", {
      email: payload,
    });

    return result;
  }

  async me() {
    const result = await instance.get("/auth/me");

    return result;
  }
}
