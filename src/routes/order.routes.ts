import express from "express";
import { createOrder, getOdersById } from "../controllers/order.controller";
import { protect } from "../controllers/auth.controller";

const router = express.Router();

router.use(protect);

router.post("/order", createOrder);
router.get("/order", getOdersById);

export default router;
