export interface RegisterDTO {
  fullName: string;
  username: string;
  email: string;
  password: string;
  activationCode: string;

  confirmPassword: string;
}

export const initialTRegister: RegisterDTO = {
  activationCode: "",
  confirmPassword: "",
  email: "",
  fullName: "",
  password: "",
  username: "",
};
