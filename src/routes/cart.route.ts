import express from "express";
const router = express.Router();
import {
  addToCart,
  getCart,
  decreaseCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import { protect } from "../controllers/auth.controller.js";

router.use(protect);

router.post("/cart", addToCart);
router.get("/cart", getCart);
router.patch("/cart/decrease", decreaseCartItemQuantity);
router.delete("/cart/remove/:cakeId", removeCartItem);
router.delete("/cart/clear", clearCart);

export default router;
