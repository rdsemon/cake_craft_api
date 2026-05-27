import { eq } from "drizzle-orm";
import db from "../../database";
import cakeTable from "../../models/cake.model";
import AppError from "../../utils/AppError";

export const findCakeById = async (cakeId: string) => {
  const [cake] = await db
    .select()
    .from(cakeTable)
    .where(eq(cakeTable.id, cakeId));

  if (!cake) {
    throw new AppError("Cake not found", 404);
  }

  return cake;
};
