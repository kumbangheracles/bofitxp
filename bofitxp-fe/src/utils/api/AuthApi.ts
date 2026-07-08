import { API_URL } from "@/constants/list_url";
import { UserProps } from "@/types/user.type";

export interface RegisterProps {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
}
export interface LoginProps {
  identifier: string;
  password: string;
}

export const userRegister = async (body: UserProps) => {
  return await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      fullName: body.fullName,
      username: body.username,
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
    }),
  });
};
export const userLogin = async (body: LoginProps) => {
  return await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      username: body.identifier,
      password: body.password,
    }),
  });
};

export const mahasiswaGetAll = async () => {
  return await fetch(`${API_URL}/mahasiswa`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
};

export const userLogout = async (token: string) => {
  return await fetch(`${API_URL}/users/logout`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};
