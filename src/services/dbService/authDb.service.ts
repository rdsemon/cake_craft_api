import { eq } from "drizzle-orm";
import db from "../../database";
import { usersTable } from "../../models/user.model";
import type { signUpUserData } from "../../types/authType";
import AppError from "../../utils/AppError";

export const signUpService = async (userData: signUpUserData) => {
  const [user] = await db
    .insert(usersTable)
    .values(userData)
    .returning({ id: usersTable.id });

  if (!user?.id) {
    throw new AppError("signUpd fail try agian", 401);
  }

  return user;
};

export const loginService = async (email: string) => {
  const [user] = await db
    .select({
      password: usersTable.password,
      email: usersTable.email,
      id: usersTable.id,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user?.email) {
    throw new AppError("User dose not exist", 404);
  }

  return user;
};
