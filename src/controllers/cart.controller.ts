import asyncHandler from "../utils/asyncHandler.js";

import {
  addToCartService,
  clearCartService,
  decreaseCartItemQuantityService,
  getCartService,
  removeCartItemService,
} from "../services/cart/cartDb.service.js";
import type { Request, Response } from "express";

export const addToCart = asyncHandler(async (req:Request, res:Response) => {
  const userId = req.user.id;
  const { quantity, cakeId } = req.body;

  await addToCartService(userId, quantity, cakeId);

  res.status(201).json({ status: "successful", message: "add to the cart" });
});

export const getCart = asyncHandler(async (req:Request, res:Response) => {
  const userId = req.user.id;

  const { cart, items } = await getCartService(userId);

  res.status(200).json({ stauts: "successful", cart, items });
});

export const decreaseCartItemQuantity = asyncHandler(async (req:Request, res:Response) => {
  const userId = req.user.id;
  const { cakeId } = req.body;
  const updatedItem = await decreaseCartItemQuantityService(userId, cakeId);

  res.status(200).json({
    status: "success",
    message: "Quantity decreased",
    data: updatedItem,
  });
});

export const removeCartItem = asyncHandler(async (req:Request, res:Response) => {
  const userId = req.user.id;
  const cakeId = req.params.cakeId as string;

  await removeCartItemService(userId, cakeId);

  res.status(200).json({
    status: "success",
    message: "Item removed from cart",
  });
});

export const clearCart = asyncHandler(async (req:Request, res:Response) => {
  const userId = req.user.id;

  await clearCartService(userId);

  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
  });
});
