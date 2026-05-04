import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import AppError from "./AppError";

export const generateJwtToken = (userId: string): string => {
  const secretKey = process.env.JWT_SECRET;

  const expiresIn = process.env.EXPIRESIN;

  if (!secretKey || !expiresIn) {
    throw new AppError(
      "JWT configuration missing: secret or expiresIn not defined",
      500,
    );
  }

  const token = jwt.sign({ userId }, secretKey, {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  });

  return token;
};
