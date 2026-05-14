import express from "express";
import { createCakeSchema, updateCakeSchema } from "../zodSchema/cake.schema";
import validateInput from "../middlewares/zodValidator";

const router = express.Router();

import {
  getAllCakes,
  getOneCakeById,
  createCake,
  updateCakeInfo,
  deleteCakeById,
  deleteAllCakes,
} from "../controllers/cake.controller";

router
  .route("/cakes")
  .get(getAllCakes)
  .post(validateInput(createCakeSchema), createCake);
router
  .route("/cakes/:id")
  .get(getOneCakeById)
  .patch(validateInput(updateCakeSchema), updateCakeInfo)
  .delete(deleteCakeById);

router.delete("/cakes/delete", deleteAllCakes);

export default router;
