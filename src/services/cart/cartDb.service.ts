import { and, eq } from "drizzle-orm";
import db from "../../database.js";
import { cartItems } from "../../models/cart.model.js";
import cakeTable from "../../models/cake.model.js";
import AppError from "../../utils/AppError.js";

import {
  checkExistingItem,
  findCakeById,
  getOrCreateCart,
  updateCartItem,
} from "./cartDb.helper.service.js";

export const addToCartService = async (
  userId: string,
  quantity: number,
  cakeId: string,
) => {
  const [cart, cake] = await Promise.all([
    await getOrCreateCart(userId),
    await findCakeById(cakeId),
  ]);

  const existingItem = await checkExistingItem(cakeId, cart.id);

  if (existingItem) {
    const updatedQuantity = existingItem.quantity + quantity;

    if (updatedQuantity > cake.quantity) {
      throw new AppError("Requested quantity exceeds stock", 400);
    }

    await updateCartItem(cakeId, cart.id, {
      quantity: updatedQuantity,
      price: updatedQuantity * Number(cake.price),
    });

    return;
  }

  if (quantity > cake.quantity) {
    throw new AppError("Requested quantity exceeds stock", 400);
  }

  await db.insert(cartItems).values({
    cakeId,
    cartId: cart.id,
    quantity,
    price: Number(cake.price) * quantity,
  });
};

export const getCartService = async (userId: string) => {
  const cart = await getOrCreateCart(userId);

  const items = await db
    .select({
      cartId: cartItems.cartId,
      quantity: cartItems.quantity,
      price: cartItems.price,

      cakeId: cakeTable.id,
      title: cakeTable.title,
      cakePrice: cakeTable.price,
      cakeQuantity: cakeTable.quantity,
    })
    .from(cartItems)
    .innerJoin(cakeTable, eq(cartItems.cakeId, cakeTable.id))
    .where(eq(cartItems.cartId, cart.id));

  const totalAmount = items.reduce((sum, item) => sum + Number(item.price), 0);

  return {
    cart,
    totalAmount,
    items,
  };
};

export const decreaseCartItemQuantityService = async (
  userId: string,
  cakeId: string,
) => {
  const cart = await getOrCreateCart(userId);

  const cartItem = await checkExistingItem(cakeId, cart.id);

  if (!cartItem) {
    throw new AppError("Item not found in cart", 404);
  }

  if (cartItem.quantity === 1) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));

    return;
  }

  const cake = await findCakeById(cakeId);

  const updatedQuantity = cartItem.quantity - 1;

  const updatedPrice = updatedQuantity * Number(cake.price);

  return await updateCartItem(cakeId, cart.id, {
    quantity: updatedQuantity,
    price: updatedPrice,
  });
};

export const removeCartItemService = async (userId: string, cakeId: string) => {
  const cart = await getOrCreateCart(userId);

  const item = await checkExistingItem(cakeId, cart.id);

  if (!item) {
    throw new AppError("Item not found in cart", 404);
  }

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));
};

export const clearCartService = async (userId: string) => {
  const cart = await getOrCreateCart(userId);

  const deletedItems = await db
    .delete(cartItems)
    .where(eq(cartItems.cartId, cart.id))
    .returning();

  return {
    deletedCount: deletedItems.length,
  };
};
