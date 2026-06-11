import { eq } from "drizzle-orm";
import db from "../../database.js";
import cakeTable from "../../models/cake.model.js";
import AppError from "../../utils/AppError.js";
import { sql } from "drizzle-orm";
import type {
  CreateCakeBody,
  UpdateCakeBody,
} from "../../zodSchema/cake.schema.js";

export const getAllCakesService = async (search: string) => {
  let cakes;
  if (search) {
    cakes = await db
      .select()
      .from(cakeTable)
      .where(
        sql`to_tsvector('english', ${cakeTable.title}) @@ to_tsquery('english', ${search})`,
      );
  } else {
    cakes = await db.select().from(cakeTable);
  }

  return cakes;
};

export const getOneCakeService = async (id: string) => {
  const cake = await db
    .select()
    .from(cakeTable)
    .where(eq(cakeTable.id, id))
    .limit(1);

  if (!cake || cake.length === 0) {
    throw new AppError("Cake not found", 404);
  }
  return cake;
};

export const createCakeService = async (cakeData: CreateCakeBody) => {
  const [newCake] = await db
    .insert(cakeTable)
    .values(cakeData)
    .returning({ id: cakeTable.id });

  if (!newCake?.id) {
    throw new AppError("Uploading cake fail", 400);
  }

  return newCake;
};

export const updateCakeService = async (
  id: string,
  cakeData: UpdateCakeBody,
) => {
  const updatedCake = await db
    .update(cakeTable)
    .set(cakeData)
    .where(eq(cakeTable.id, id))
    .returning({ id: cakeTable.id });

  if (!updatedCake || updatedCake.length === 0) {
    throw new AppError("Update fail cake not found", 400);
  }
};

export const deleteCakeService = async (id: string) => {
  await db.delete(cakeTable).where(eq(cakeTable.id, id));
  return;
};

export const deleteAllCakesService = async () => {
  await db.delete(cakeTable);
  return;
};
