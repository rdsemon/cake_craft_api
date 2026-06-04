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

router.post("/order", validateInput(createOrderSchema), createOrder);
router.get("/order", getMyOders);
router.get("/order/:orderId", getOrders);

export default router;
