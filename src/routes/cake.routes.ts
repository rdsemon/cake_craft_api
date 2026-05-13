import express from "express";

const router = express.Router();

import {
  getAllCakes,
  getOneCakeById,
  createCake,
  updateCakeInfo,
  deleteCakeById,
  deleteAllCakes,
} from "../controllers/cake.controller";

router.route("/cakes").get(getAllCakes).post(createCake);
router
  .route("/cakes/:id")
  .get(getOneCakeById)
  .patch(updateCakeInfo)
  .delete(deleteCakeById);

router.delete("/cakes/delete", deleteAllCakes);

export default router;
