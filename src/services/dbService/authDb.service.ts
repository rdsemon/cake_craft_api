import { eq } from "drizzle-orm";
import db from "../../database";
import { usersTable } from "../../models/user.model";
import type { signUpUserData } from "../../types/authType";

export const signUpService = async (userData: signUpUserData) => {
  return await db
    .insert(usersTable)
    .values(userData)
    .returning({ id: usersTable.id });
};

export const loginService = async (email: string) => {
  return await db
    .select({
      password: usersTable.password,
      email: usersTable.email,
      id: usersTable.id,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));
};
