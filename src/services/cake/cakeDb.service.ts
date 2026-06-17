import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import db from "../../database.js";
import cakeTable from "../../models/cake.model.js";
import AppError from "../../utils/AppError.js";
import type { GetCakesOptions } from "../../types/controllerTypes.js";

import type {
  CreateCakeBody,
  UpdateCakeBody,
} from "../../zodSchema/cake.schema.js";

export const getAllCakesService = async (options: GetCakesOptions) => {
  const conditions = [];

  // Search
  if (options.search) {
    conditions.push(
      sql`to_tsvector('english', ${cakeTable.title})
          @@ plainto_tsquery('english', ${options.search})`,
    );
  }

  // Price Filter
  if (options.minPrice) {
    conditions.push(gte(cakeTable.price, Number(options.minPrice)));
  }

  if (options.maxPrice) {
    conditions.push(lte(cakeTable.price, Number(options.maxPrice)));
  }

  const query = db.select().from(cakeTable);

  if (conditions.length) {
    query.where(and(...conditions));
  }

  // Sorting
  switch (options.sort) {
    case "price-asc":
      query.orderBy(asc(cakeTable.price));
      break;

    case "price-desc":
      query.orderBy(desc(cakeTable.price));
      break;

    case "title":
      query.orderBy(asc(cakeTable.title));
      break;

    default:
      query.orderBy(desc(cakeTable.createdAt));
  }

  // Pagination
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const offset = (page - 1) * limit;

  query.limit(limit).offset(offset);

  const cakes = await query;

  return {
    cakes,
    page,
    limit,
  };
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
