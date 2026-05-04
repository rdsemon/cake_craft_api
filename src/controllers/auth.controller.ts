import { eq } from "drizzle-orm";
import db from "../database";
import { usersTable } from "../models/user.model";
import AppError from "../utils/AppError";
import asyncHandler from "../utils/asyncHandler";
import { comparePass, createHashPass } from "../utils/passwordGenerator";
import type { signUpBody, loginBody } from "../zodSchema/auth.schema";
import { generateJwtToken } from "../utils/sendJWT";
import sendJwtCooke from "../utils/sendJwtCookie";

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
