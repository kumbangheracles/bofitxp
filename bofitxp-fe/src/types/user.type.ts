export interface UserProps {
  id: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  activationCode?: string | null;
  isVerified: boolean;
  level?: number | null;
  streak?: number | null;
  avatarUrl?: string | null;
  xp?: number | null;
  body_weight: number;
  body_height: number;
  body_mass_index: number;
  role: "MEMBER" | "ADMIN";
  expireAt?: string | null;
  createdAt: string;
  updatedAt: string;

  confirmPassword: string;
}
