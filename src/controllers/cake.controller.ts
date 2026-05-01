import type { Request, Response, NextFunction } from "express";
export const getAllCakes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.send("Here is your cakes");
};
