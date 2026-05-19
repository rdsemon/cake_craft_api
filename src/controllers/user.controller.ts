import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import type { updateUserBody } from "../zodSchema/user.schema";
import {
  deleteAllUsersService,
  deleteuserService,
  getAllUsersService,
  getUserService,
  updateUserService,
} from "../services/dbService/userDb.service";

// get all the users from database
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();

  res.status(200).json({ status: "successful", total: users.length, users });
});

//get user data by their id
export const getUserById = asyncHandler(async (req, res, next) => {
  const id = req.params.id as string;

  if (!id) {
    return next(new AppError("Id is required", 400));
  }

  const user = await getUserService(id);

  res.status(200).json({ status: "successful", user });
});

// update user data in database
export const updateUser = asyncHandler(async (req, res, next) => {
  const userData = req.body as updateUserBody;
  const id = req.params.id as string;

  if (!id) {
    return next(new AppError("Id is required", 404));
  }

  const user = await getUserService(id);

  if (userData.email === user.email && userData.name === user.name) {
    return res.status(200).json({ message: "Already up to date" });
  }
  const updatedUser = await updateUserService(userData, id);

  res.status(200).json({
    status: "successful",
    message: `User update successful ${updatedUser.id}`,
  });
});

//Delete user from the database by their id
export const deleteUserById = asyncHandler(async (req, res, next) => {
  const id = req.params.id as string;
  if (!id) {
    return next(new AppError("Id is required", 400));
  }
  // check if the user exist
  await getUserService(id);
  // delete the user
  await deleteuserService(id);

  res
    .status(200)
    .json({ status: "sucessful", message: "Account delete successful" });
});

//Delete all the users
export const deleteAllUsers = asyncHandler(async (req, res) => {
  await deleteAllUsersService();
  res.status(200).json({ status: "successful", message: "All users deleted" });
});
