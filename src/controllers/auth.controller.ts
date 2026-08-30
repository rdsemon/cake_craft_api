import db from "../database.js";
import { eq } from "drizzle-orm";
import AppError from "../utils/AppError.js";
import type { JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { usersTable } from "../models/user.model.js";
import sendJwtCooke from "../utils/sendJwtCookie.js";
import type { Request, Response, NextFunction } from "express";
import { generateJwtToken, verifyToken } from "../utils/sendJwt.js";
import type { signUpBody, loginBody } from "../zodSchema/auth.schema.js";
import { comparePass, createHashPass } from "../utils/passwordGenerator.js";
import {
  signUpService,
  loginService,
} from "../services/auth/authDb.service.js";

// user signUp
export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as signUpBody;

  const hashPass = await createHashPass(password);

  const userData = { name, email, password: hashPass };

  const user = await signUpService(userData);

  res.status(201).json({ status: "sucessful", id: user.id });
});

// user login
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as loginBody;

    const user = await loginService(email);

    const isCorrectPass = await comparePass(password, user.password);

    if (!isCorrectPass) {
      return next(new AppError("Wrong email or password", 401));
    }

    const jwtToken = generateJwtToken(user.id);

    sendJwtCooke(res, jwtToken);

    res
      .status(200)
      .json({ status: "successful", message: "login successful", id: user.id });
  },
);

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    const decode = verifyToken(token) as JwtPayload;
    const { userId } = decode;

    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
        name: usersTable.name,
        image: usersTable.image,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      return next(new AppError("Please loign first", 401));
    }

    req.user = user;

    next();
  },
);

export const restrictedTo = (rules: string[]) =>
  asyncHandler((req: Request, res: Response, next: NextFunction) => {
    if (!rules.includes(req.user.role)) {
      return next(new AppError("you are not permited to do this action", 403));
    }

    next();
  });

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ status: "successful", data: req.user });
});

export const checkOwnership = (paramKey = "id") =>
  asyncHandler((req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    if (req.user.role === "admin") {
      return next();
    }

    if (req.user.id !== req.params[paramKey]) {
      return next(new AppError("You can only access your own data", 403));
    }

    next();
  });
