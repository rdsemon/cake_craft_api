import { and, eq } from "drizzle-orm";
import db from "../../database.js";
import cakeTable from "../../models/cake.model.js";
import AppError from "../../utils/AppError.js";
import { cartItems, carts } from "../../models/cart.model.js";

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

export const getOrCreateCart = async (userId: string) => {
  let [cart] = await db.select().from(carts).where(eq(carts.userId, userId));

  if (!cart) {
    // careate cart
    const [newCart] = await db.insert(carts).values({ userId }).returning();

    if (!newCart) {
      throw new AppError("Cart creation faile", 400);
    }

    cart = newCart;
  }

  return cart;
};

export const checkExistingItem = async (cakeId: string, cartId: string) => {
  const [existingItem] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.cakeId, cakeId)));

  return existingItem;
};

export const updateCartItem = async (
  cakeId: string,
  cartId: string,
  data: {
    price?: number;
    quantity?: number;
  },
) => {
  const [updatedItem] = await db
    .update(cartItems)
    .set(data)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.cakeId, cakeId)))
    .returning();

  if (!updatedItem) {
    throw new AppError("Update fail", 400);
  }

  return updatedItem;
};
