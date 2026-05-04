import type { Response } from "express";
const sendJwtCooke = (res: Response, token: string) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("token", token, cookieOptions);
};

export default sendJwtCooke;
