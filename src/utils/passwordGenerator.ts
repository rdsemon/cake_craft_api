import bcrypt from "bcryptjs";
import AppError from "./AppError.js";

export const createHashPass = async (password: string) => {
  const solt = Number(process.env.SOLTROUNDS);
  if (!password) {
    throw new AppError("password is required", 400);
  }
  const hashPass = await bcrypt.hash(password, solt);

  return hashPass;
};

export const comparePass = async (dbPass: string, givenPass: string) =>
  await bcrypt.compare(dbPass, givenPass);
