export interface UserProps {
  id: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  activationCode: string;

  confirmPassword: string;
}
