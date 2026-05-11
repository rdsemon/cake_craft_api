import asyncHandler from "../utils/asyncHandler";
import db from "../database";
import { usersTable } from "../models/user.model";
import { eq } from "drizzle-orm";
import AppError from "../utils/AppError";
import type { updateUserBody } from "../zodSchema/user.schema";

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    })
    .from(usersTable);

  res.status(200).json({ status: "successful", total: users.length, users });
});

export const getUserById = asyncHandler(async (req, res, next) => {
  const id = req.params.id as string;

  if (!id) {
    return next(new AppError("Id is required", 400));
  }

  const user = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.id, id));

  if (!user || user.length === 0) {
    return next(new AppError("User dose not found", 404));
  }

  res.status(200).json({ status: "successful", user });
});

export const updatUser = asyncHandler(async (req, res, next) => {
  const { name, email, image, publicId } = req.body as updateUserBody;

  const id = req.params.id as string;

  if (!id) {
    return next(new AppError("Id is required", 404));
  }

  const [user] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
    })
    .from(usersTable)
    .where(eq(usersTable.id, id));

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const { name: existingName, email: existingEmail } = user;

  if (existingEmail === email && existingName === name) {
    return res.status(200).json({ message: "Already up to date" });
  }
  const [updatedUser] = await db
    .update(usersTable)
    .set({ email, name, image, publicId })
    .where(eq(usersTable.id, id))
    .returning({ id: usersTable.id });

  if (!updatedUser) {
    return next(new AppError("Profile update fail", 400));
  }

  res.status(200).json({
    status: "successful",
    message: `User update successful ${updatedUser?.id}`,
  });
});

export const deleteUserById = asyncHandler(async (req, res, next) => {
  const id = req.params.id as string;
  if (!id) {
    return next(new AppError("Id is required", 400));
  }

  const user = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.id, id));

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  await db.delete(usersTable).where(eq(usersTable.id, id));

  res
    .status(200)
    .json({ status: "sucessful", message: "Account delete successful" });
});

export const deleteAllUsers = asyncHandler(async (req, res, next) => {
  await db.delete(usersTable);

  res.status(200).json({ status: "successful", message: "All users deleted" });
});

export const updateUserTest = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);

  res.send("get the call");
});
