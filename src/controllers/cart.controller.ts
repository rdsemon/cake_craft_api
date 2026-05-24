import asyncHandler from "../utils/asyncHandler";
import { cartItems, carts } from "../models/cart.model";
import db from "../database";
import { and, eq } from "drizzle-orm";
import cakeTable from "../models/cake.model";
import AppError from "../utils/AppError";

export const addToCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { quantity, cakeId } = req.body;

  let [cart] = await db.select().from(carts).where(eq(carts.userId, userId));

  if (!cart) {
    const [newCart] = await db.insert(carts).values({ userId }).returning();

    if (!newCart) {
      return next(new AppError("Fail to create cart", 400));
    }

    cart = newCart;
  }

  const [cake] = await db
    .select()
    .from(cakeTable)
    .where(eq(cakeTable.id, cakeId));

  if (!cake) {
    return next(new AppError("Cake not found", 404));
  }

  const [existingItem] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));

  if (existingItem) {
    await db
      .update(cartItems)
      .set({
        quantity: existingItem.quantity + quantity,
        price: (existingItem.quantity + quantity) * cake.price,
      })
      .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));

    return;
  }

  const cartItemsData = {
    cartId: cart.id,
    quantity,
    price: cake.price,
    cakeId: cake.id,
  };

  await db.insert(cartItems).values(cartItemsData);
  
  res.status(201).json({ status: "successful", message: "add to the cart" });
});
