import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import db from "../database";
import cakeTable from "../models/cake.model";
import { eq } from "drizzle-orm";

export const getAllCakes = asyncHandler(async (req, res, next) => {
  const cakes = await db.select().from(cakeTable);

  res
    .status(200)
    .json({ status: "successful", total: cakes.length, data: cakes });
});

export const createCake = asyncHandler(async (req, res, next) => {
  const [newCake] = await db
    .insert(cakeTable)
    .values(req.body)
    .returning({ id: cakeTable.id });

  if (!newCake?.id) {
    return next(new AppError("Uploading cake fail", 400));
  }
  res.status(201).json({
    status: "successful",
    message: `Upload cake successful id:${newCake.id} `,
  });
});

export const getOneCakeById = asyncHandler(async (req, res, next) => {
  const id = req.params.id as string;

  const cake = await db
    .select()
    .from(cakeTable)
    .where(eq(cakeTable.id, id))
    .limit(1);

  if (!cake || cake.length === 0) {
    return next(new AppError("Cake not found", 404));
  }

  res.status(200).json({ status: "successful", data: cake });
});

export const updateCakeInfo = asyncHandler(async (req, res, next) => {
  const id = req.params.id as string;

  const cake = await db
    .select()
    .from(cakeTable)
    .where(eq(cakeTable.id, id))
    .limit(1);

  if (!cake || cake.length === 0) {
    return next(new AppError("Cake not found", 404));
  }

  const updatedCake = await db
    .update(cakeTable)
    .set(req.body)
    .where(eq(cakeTable.id, id))
    .returning({ id: cakeTable.id });

  if (!updatedCake || updatedCake.length === 0) {
    return next(new AppError("Update fail", 400));
  }

  res.status(200).json({ status: "successful", message: "update successfull" });
});

export const deleteCakeById = asyncHandler(async (req, res, next) => {
  const id = req.params.id as string;

  const cake = await db
    .select()
    .from(cakeTable)
    .where(eq(cakeTable.id, id))
    .limit(1);

  if (!cake || cake.length === 0) {
    return next(new AppError("Cake not found", 404));
  }

  await db.delete(cakeTable).where(eq(cakeTable.id, id));

  res
    .status(204)
    .json({ status: "successful", message: "Deleting successful" });
});

export const deleteAllCakes = asyncHandler(async (req, res, next) => {
  await db.delete(cakeTable);
  res.status(204).json({ status: "successful" });
});
