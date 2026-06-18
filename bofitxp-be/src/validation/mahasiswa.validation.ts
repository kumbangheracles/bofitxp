import * as Yup from "yup";
import { Mahasiswa } from "../generated/prisma/client";
export interface MahasiswaDTO extends Mahasiswa {}

export const MahasiswaValidation = Yup.object<MahasiswaDTO>({
  fullName: Yup.string().required(),
  noHp: Yup.string().required(),
  email: Yup.string().email().required(),
  nim: Yup.string().required(),
  jurusan: Yup.string().required(),
});
