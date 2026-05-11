import { eq } from "drizzle-orm";
import db from "../database";
import { usersTable } from "../models/user.model";
import AppError from "../utils/AppError";
import asyncHandler from "../utils/asyncHandler";
import { comparePass, createHashPass } from "../utils/passwordGenerator";
import type { signUpBody, loginBody } from "../zodSchema/auth.schema";
import { generateJwtToken, verifyToken } from "../utils/sendJwt";
import sendJwtCooke from "../utils/sendJwtCookie";
import type { JwtPayload } from "jsonwebtoken";

// user signUp
export const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body as signUpBody;

  const hassPass = await createHashPass(password);

  const userData = { name, email, password: hassPass };

  const [user] = await db
    .insert(usersTable)
    .values(userData)
    .returning({ id: usersTable.id });

  if (!user?.id) {
    return next(new AppError("signUpd fail try agian", 401));
  }

  res.status(201).json({ status: "sucessful", id: user.id });
});

// user login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body as loginBody;

  const [user] = await db
    .select({
      password: usersTable.password,
      email: usersTable.email,
      id: usersTable.id,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user?.email) {
    return next(new AppError("User dose not exist", 404));
  }

  const isCorrectPass = await comparePass(password, user.password);

  if (!isCorrectPass) {
    return next(new AppError("Wrong email or password", 401));
  }

  const jwtToken = generateJwtToken(user.id);

  sendJwtCooke(res, jwtToken);

  res.status(200).json({ status: "successful", message: "login successful" });
});

export const protect = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  const decode = verifyToken(token) as JwtPayload;
  const { userId } = decode;

  const [user] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      role: usersTable.role,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  if (!user) {
    return next(new AppError("Please loign first", 401));
  }

  req.user = user;

  next();
});

export const restrictedTo = (rules: string[]) =>
  asyncHandler((req, res, next) => {
    if (!rules.includes(req.user.role)) {
      return next(new AppError("you are not permited to do this action", 403));
    }

    next();
  });

export const checkOwnership = (paramKey = "id") =>
  asyncHandler((req, res, next) => {
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
