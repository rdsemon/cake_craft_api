import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import AppError from "./AppError.js";

const secretKey = process.env.JWT_SECRET;
const expiresIn = process.env.EXPIRESIN;

if (!secretKey || !expiresIn) {
  throw new AppError(
    "JWT configuration missing: secret or expiresIn not defined",
    500,
  );
}

export const generateJwtToken = (userId: string): string => {
  const token = jwt.sign({ userId }, secretKey, {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  } as SignOptions);

  return token;
};

export const verifyToken = (token: string) => jwt.verify(token, secretKey);
