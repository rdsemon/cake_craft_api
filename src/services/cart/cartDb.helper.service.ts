import { and, eq } from "drizzle-orm";
import db from "../../database";
import cakeTable from "../../models/cake.model";
import AppError from "../../utils/AppError";
import { cartItems, carts } from "../../models/cart.model";

export const findCakeById = async (cakeId: string) => {
  const [cake] = await db
    .select()
    .from(cakeTable)
    .where(eq(cakeTable.id, cakeId));

  if (!cake) {
    throw new AppError("Cake not found", 404);
  }

  return cake;
};

export const findCartById = async (userId: string) => {
  const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  return cart;
};

export const checkExistingItem = async (cakeId: string) => {
  const [existingItem] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, carts.id), eq(cartItems.cakeId, cakeId)));

  if (!existingItem) {
    throw new AppError("Item not found in cart", 404);
  }

  return existingItem;
};

export const updateCartItem = async (
  price: number,
  quantity: number,
  cakeId: string,
) => {
  const [updatedItem] = await db
    .update(cartItems)
    .set({ price, quantity })
    .where(and(eq(cartItems.cartId, carts.id), eq(cartItems.cakeId, cakeId)))
    .returning();

  if (!updatedItem) {
    throw new AppError("Update fail", 400);
  }

  return updatedItem;
};
