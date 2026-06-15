import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import {
  getAllCakesService,
  getOneCakeService,
  createCakeService,
  deleteCakeService,
  updateCakeService,
  deleteAllCakesService,
} from "../services/cake/cakeDb.service.js";


export const getAllCakes = asyncHandler(async (req:Request, res:Response) => {
  const options = req.query;
  const result = await getAllCakesService(options);
  res
    .status(200)
    .json({
      status: "successful",
      total: result.cakes.length,
      data: result.cakes,
      page: result.page,
      limit: result.limit,
    });
});

export const createCake = asyncHandler(async (req:Request, res:Response) => {
  const cake = await createCakeService(req.body);
  res.status(201).json({
    status: "successful",
    message: `Upload cake successful id:${cake.id} `,
  });
});

export const getOneCakeById = asyncHandler(async (req:Request, res:Response) => {
  const id = String(req.params.id);

  const cake = await getOneCakeService(id);
  res.status(200).json({ status: "successful", data: cake });
});

export const updateCakeInfo = asyncHandler(async (req:Request, res:Response) => {
  const id = String(req.params.id);
  await updateCakeService(id, req.body);
  res.status(200).json({ status: "successful", message: "update successfull" });
});

export const deleteCakeById = asyncHandler(async (req:Request, res:Response) => {
  const id = req.params.id as string;
  //checking if the cake data exist
  await getOneCakeService(id);
  //delete cake
  await deleteCakeService(id);

  res.status(204).send();
});

export const deleteAllCakes = asyncHandler(async (req:Request, res:Response) => {
  await deleteAllCakesService();
  res.status(204).send();
});
