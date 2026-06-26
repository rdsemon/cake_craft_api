import express from "express";
import {
  createOrder,
  getMyOders,
  getOrders,
} from "../controllers/order.controller.js";
import { protect } from "../controllers/auth.controller.js";
import { createOrderSchema } from "../zodSchema/order.schema.js";
import validateInput from "../middlewares/zodValidator.js";

const router = express.Router();

router.use(protect);

router.post("/orders", validateInput(createOrderSchema), createOrder);
router.get("/orders", getMyOders);
router.get("/orders/:orderId", getOrders);

export default router;
