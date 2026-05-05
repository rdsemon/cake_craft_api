import express from "express";
import {
  restrictedTo,
  protect,
  checkOwnership,
} from "../controllers/auth.controller";
import { updateUserSchema } from "../zodSchema/user.schema";
import validateInput from "../middlewares/zodValidator";
import {
  getAllUsers,
  getUserById,
  updatUser,
  deleteUserById,
  deleteAllUsers,
} from "../controllers/user.controller";

const router = express.Router();

const updateUserMiddlewares = [
  protect,
  restrictedTo(["customer", "admin"]),
  validateInput(updateUserSchema),
];
const deleteUserByIdMiddlewares = [
  protect,
  restrictedTo(["customer", "admin"]),
];
const getUserByIdMiddlewares = [
  protect,
  restrictedTo(["customer"]),
  checkOwnership("id"),
];
const deleteAllUsersMiddlewares = [protect, restrictedTo(["admin"])];

router.get("/user", protect, restrictedTo(["admin"]), getAllUsers);

router
  .route("/user/:id")
  .get(getUserByIdMiddlewares, getUserById)
  .patch(updateUserMiddlewares, updatUser)
  .delete(deleteUserByIdMiddlewares, deleteUserById);

router.delete("/user", deleteAllUsersMiddlewares, deleteAllUsers);

export default router;
