import * as Yup from "yup";

export interface MahasiswaDTO {
  fullName: string;
  noHp: string;
  email: string;
  nim: string;
  jurusan: string;
}

export const MahasiswaValidation = Yup.object<MahasiswaDTO>({
  fullName: Yup.string().required(),
  noHp: Yup.string().required(),
  email: Yup.string().email().required(),
  nim: Yup.string().required(),
  jurusan: Yup.string().required(),
});
