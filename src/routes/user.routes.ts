import express from "express";

import {
  protect,
  restrictedTo,
  checkOwnership,
} from "../controllers/auth.controller";

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
  deleteAllUsers,
} from "../controllers/user.controller";

import validateInput from "../middlewares/zodValidator";
import resizeAndUploadPhoto from "../middlewares/resizeAndUploadPhoto";

import { updateUserSchema } from "../zodSchema/user.schema";

import upload from "../utils/multer";

const router = express.Router();

// Reusable role middlewares
const adminOnly = [protect, restrictedTo(["admin"])];

const customerAndAdmin = [protect, restrictedTo(["customer", "admin"])];

// Routes
router.get("/users", ...adminOnly, getAllUsers);

router.delete("/users", ...adminOnly, deleteAllUsers);

router
  .route("/users/:id")
  .get(protect, restrictedTo(["customer"]), checkOwnership("id"), getUserById)

  .patch(
    ...customerAndAdmin,
    upload.single("image"),
    resizeAndUploadPhoto,
    validateInput(updateUserSchema),
    updateUser,
  )

  .delete(...customerAndAdmin, deleteUserById);

export default router;
