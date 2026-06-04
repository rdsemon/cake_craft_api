import express from "express";

import {
  protect,
  restrictedTo,
  checkOwnership,
} from "../controllers/auth.controller.js";

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
  deleteAllUsers,
} from "../controllers/user.controller.js";

import validateInput from "../middlewares/zodValidator.js";
import resizeAndUploadPhoto from "../middlewares/resizeAndUploadPhoto.js";

import { updateUserSchema } from "../zodSchema/user.schema.js";

import upload from "../utils/multer.js";

const router = express.Router();

// Reusable role middlewares
const adminOnly = [protect, restrictedTo(["admin"])];

const customerAndAdmin = [protect, restrictedTo(["customer", "admin"])];

// Routes
router.get("/users", ...adminOnly, getAllUsers);

router.delete("/users", ...adminOnly, deleteAllUsers);

router
  .route("/users/:id")
  .get(
    protect,
    restrictedTo(["customer", "admin"]),
    checkOwnership("id"),
    getUserById,
  )

  .patch(
    ...customerAndAdmin,
    upload.single("image"),
    resizeAndUploadPhoto,
    validateInput(updateUserSchema),
    checkOwnership("id"),
    updateUser,
  )

  .delete(...customerAndAdmin, deleteUserById);

export default router;
