export type UserGender = "pria" | "wanita";
export type UserTargetFinal =
  | "weight_loss"
  | "muscle_gain"
  | "maintain_fitness"
  | "endurance";

export interface UserProps {
  id: string;
  fullName: string;
  username: string;
  email: string;
  password?: string;
  activationCode?: string | null;
  isVerified: boolean;
  level?: number | null;
  streak?: number | null;
  avatarUrl?: string | null;
  xp?: number | null;
  gender?: UserGender | null;
  age?: number | null;
  body_weight?: number | null;
  body_height?: number | null;
  body_mass_index?: number | null;
  target_final?: UserTargetFinal | null;
  targetFinal?: UserTargetFinal | null;
  role?: "MEMBER" | "ADMIN";
  expireAt?: string | null;
  createdAt?: string;
  updatedAt?: string;

  confirmPassword?: string;
}
