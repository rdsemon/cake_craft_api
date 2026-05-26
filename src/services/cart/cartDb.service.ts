import { and, eq } from "drizzle-orm";
import db from "../../database";
import { cartItems, carts } from "../../models/cart.model";
import AppError from "../../utils/AppError";
import cakeTable from "../../models/cake.model";

export const addToCartService = async (
  userId: string,
  quantity: number,
  cakeId: string,
) => {
  //find the cart
  let [cart] = await db.select().from(carts).where(eq(carts.userId, userId));

  if (!cart) {
    // careate cart
    const [newCart] = await db.insert(carts).values({ userId }).returning();

    if (!newCart) {
      throw new AppError("Cart creation faile", 400);
    }

    cart = newCart;
  }

  //find the cake item in database

  const [cake] = await db
    .select()
    .from(cakeTable)
    .where(eq(cakeTable.id, cakeId));

  if (!cake) {
    throw new AppError("Cake not found", 404);
  }

  // check if the item alrady exist in cartItems

  const [existingItem] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));

  if (existingItem) {
    const updateQuantity = existingItem.quantity + quantity;
    const updatePrice = Number(updateQuantity) * cake.price;

    if (existingItem.quantity >= cake.quantity) {
      throw new AppError("Limit reached", 400);
    }

    // update the item price and quantity

    await db
      .update(cartItems)
      .set({
        quantity: updateQuantity,
        price: updatePrice,
      })
      .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));

    return;
  }

  // insert the new item in the cart

  const cartItemsData = {
    cakeId: cake.id,
    cartId: cart.id,
    quantity,
    price: cake.price,
  };

  await db.insert(cartItems).values(cartItemsData);
};

export const getCartService = async (userId: string) => {
  const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  // 2. Get cart items with cake info
  const [items] = await db
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

  return { cart, items };
};

export const decreaseCartItemQuantityService = async (
  userId: string,
  cakeId: string,
) => {
  // find user cart
  const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  // find cart item
  const [cartItem] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));

  if (!cartItem) {
    throw new AppError("Item not found in cart", 404);
  }

  // if quantity is 1 remove item
  if (cartItem.quantity === 1) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));

    throw new AppError("Item remove from the cart", 400);
  }

  // find cake price
  const [cake] = await db
    .select()
    .from(cakeTable)
    .where(eq(cakeTable.id, cakeId));

  if (!cake) {
    throw new AppError("Cake not found", 404);
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
    throw new AppError("Failed to update cart", 400);
  }

  return updatedItem;
};

export const removeCartItemService = async (userId: string, cakeId: string) => {
  if (!cakeId) {
    throw new AppError("Cake Id is required", 404);
  }

  // find user cart
  const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  // check cart item exists
  const [cartItem] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));

  if (!cartItem) {
    throw new AppError("Item not found in cart", 404);
  }

  // remove item
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));
};

export const clearCartService = async (userId: string) => {
  const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));

  if (!cart) {
    throw new AppError("User not found", 404);
  }

  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
};
