import { Request, Response } from "express";
import {
  MahasiswaDTO,
  MahasiswaValidation,
} from "../validation/mahasiswa.validation";
import prisma from "../utils/prisma";
export default {
  async createMahasiswa(req: Request, res: Response) {
    const { fullName, email, jurusan, nim, noHp } = req.body as MahasiswaDTO;

    try {
      await MahasiswaValidation.validate({
        fullName,
        email,
        jurusan,
        nim,
        noHp,
      });

      const result = await prisma.mahasiswa.create({
        data: { fullName, email, jurusan, nim, noHp },
      });

      res.status(200).json({
        message: "Success create mahasiwa!",
        result: result,
      });
    } catch (error: any) {
      const err = error as Error;
      console.log("error: ", err);
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async getAllMahasiswa(_req: Request, res: Response) {
    try {
      const results = await prisma.mahasiswa.findMany();

      res.status(200).json({
        message: "Success get all mahasiswa!",
        result: results,
      });
    } catch (error) {
      const err = error as Error;
      console.log("error: ", err);
      res?.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
