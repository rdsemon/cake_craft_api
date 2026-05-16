import asyncHandler from "../utils/asyncHandler";
import {
  getAllCakesService,
  getOneCakeService,
  createCakeService,
  deleteCakeService,
  updateCakeService,
  deleteAllCakesService,
} from "../services/dbService/cakeDb.services";

export const getAllCakes = asyncHandler(async (req, res) => {
  const cakes = await getAllCakesService();
  res
    .status(200)
    .json({ status: "successful", total: cakes.length, data: cakes });
});

export const createCake = asyncHandler(async (req, res) => {
  const cake = await createCakeService(req.body);
  res.status(201).json({
    status: "successful",
    message: `Upload cake successful id:${cake.id} `,
  });
});

export const getOneCakeById = asyncHandler(async (req, res) => {
  const id = String(req.params.id);

  const cake = await getOneCakeService(id);
  res.status(200).json({ status: "successful", data: cake });
});

export const updateCakeInfo = asyncHandler(async (req, res) => {
  const id = String(req.params.id);
  await updateCakeService(id, req.body);
  res.status(200).json({ status: "successful", message: "update successfull" });
});

export const deleteCakeById = asyncHandler(async (req, res) => {
  const id = req.params.id as string;
  //checking if the cake data exist
  await getOneCakeService(id);
  //delete cake
  await deleteCakeService(id);

  res.status(204).send();
});

export const deleteAllCakes = asyncHandler(async (req, res) => {
  await deleteAllCakesService();
  res.status(204).send();
});
