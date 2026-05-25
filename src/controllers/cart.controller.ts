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
    const updatedQuantity = existingItem.quantity + quantity;
    const updatePrice = updatedQuantity * cake.price;

    if (existingItem.quantity >= cake.quantity) {
      return res.send("Limit reached");
    }

    const [updatedCart] = await db
      .update(cartItems)
      .set({
        quantity: updatedQuantity,
        price: updatePrice,
      })
      .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)))
      .returning({ quantity: cartItems.quantity });

    if (!updatedCart) {
      return next(new AppError("Update cart fail", 400));
    }

    return res.send("Update the cart");
  }

  const cartItemsData = {
    cartId: cart.id,
    cakeId: cake.id,
    quantity,
    price: cake.price,
  };

  await db.insert(cartItems).values(cartItemsData);

  res.status(201).json({ status: "successful", message: "add to the cart" });
});

export const getCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  // 1. Find cart
  const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));

  if (!cart) {
    return null;
  }

  // 2. Get cart items with cake info
  const items = await db
    .select({
      cartId: cartItems.cartId,

      quantity: cartItems.quantity,

      price: cartItems.price,

      cakeId: cakeTable.id,

      title: cakeTable.title,

      cakePrice: cakeTable.price,
    })

    .from(cartItems)

    .innerJoin(cakeTable, eq(cartItems.cakeId, cakeTable.id))

    .where(eq(cartItems.cartId, cart.id));

  res.status(200).json({ stauts: "successful", cart, items });
});

export const decreaseCartItemQuantity = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { cakeId } = req.body;

  // find user cart
  const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  // find cart item
  const [cartItem] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));

  if (!cartItem) {
    return next(new AppError("Item not found in cart", 404));
  }

  // if quantity is 1 remove item
  if (cartItem.quantity === 1) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));

    return res.status(200).json({
      status: "success",
      message: "Item removed from cart",
    });
  }

  // find cake price
  const [cake] = await db
    .select()
    .from(cakeTable)
    .where(eq(cakeTable.id, cakeId));

  if (!cake) {
    return next(new AppError("Cake not found", 404));
  }

  const updatedQuantity = cartItem.quantity - 1;

  const updatedPrice = updatedQuantity * Number(cake.price);

  // update quantity
  const [updatedItem] = await db
    .update(cartItems)
    .set({
      quantity: updatedQuantity,
      price: updatedPrice,
    })
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)))
    .returning();

  if (!updatedItem) {
    return next(new AppError("Failed to update cart", 400));
  }

  res.status(200).json({
    status: "success",
    message: "Quantity decreased",
    data: updatedItem,
  });
});

export const removeCartItem = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const cakeId = req.params.cakeId as string;

  if (!cakeId) {
    return next(new AppError("Cake Id is required", 404));
  }

  // find user cart
  const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  // check cart item exists
  const [cartItem] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));

  if (!cartItem) {
    return next(new AppError("Item not found in cart", 404));
  }

  // remove item
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));

  res.status(200).json({
    status: "success",
    message: "Item removed from cart",
  });
});

export const clearCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));

  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
  });
});
