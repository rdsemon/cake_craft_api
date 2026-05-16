import { eq } from "drizzle-orm";
import db from "../../database";
import { usersTable } from "../../models/user.model";
import AppError from "../../utils/AppError";
import type { updateUserBody } from "../../zodSchema/user.schema";

const selectedFields = {
  id: usersTable.id,
  name: usersTable.name,
  email: usersTable.email,
};

export const getAllUsersService = async () => {
  return await db.select(selectedFields).from(usersTable);
};

export const getUserService = async (id: string) => {
  const user = await db
    .select(selectedFields)
    .from(usersTable)
    .where(eq(usersTable.id, id));

  if (!user) {
    throw new AppError("User dose not found", 404);
  }

  return user;
};

export const updateUserService = async (
  setValues: updateUserBody,
  id: string,
) => {
  const updatedUser = await db
    .update(usersTable)
    .set(setValues)
    .where(eq(usersTable.id, id))
    .returning({ id: usersTable.id });

  if (!updatedUser) {
    throw new AppError("Profile update fail", 400);
  }

  return updatedUser;
};

export const deleteuserService = async (id: string) => {
  return await db.delete(usersTable).where(eq(usersTable.id, id));
};

export const deleteAllUsersService = async () => {
  return await db.delete(usersTable);
};
