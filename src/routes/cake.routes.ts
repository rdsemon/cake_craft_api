import express from "express";
import {
  createCakeSchema,
  updateCakeSchema,
} from "../zodSchema/cake.schema.js";
import validateInput from "../middlewares/zodValidator.js";

const router = express.Router();

import {
  getAllCakes,
  getOneCakeById,
  createCake,
  updateCakeInfo,
  deleteCakeById,
  deleteAllCakes,
} from "../controllers/cake.controller.js";

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
