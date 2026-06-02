import express from "express";
import {
  createOrder,
  getMyOders,
  getOrders,
} from "../controllers/order.controller";
import { protect } from "../controllers/auth.controller";

const router = express.Router();

router.use(protect);

router.post("/order", createOrder);
router.get("/order", getMyOders);
router.get("/order/:orderId", getOrders);

export default router;
