import express from "express";
import {
  getAllUsers,
  getUserById,
  updatUser,
  deleteUserById,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/user", getAllUsers);

router
  .route("/user/:id")
  .get(getUserById)
  .patch(updatUser)
  .delete(deleteUserById);

export default router;
