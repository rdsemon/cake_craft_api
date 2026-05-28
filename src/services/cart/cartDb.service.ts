import { and, eq } from "drizzle-orm";
import db from "../../database";
import { cartItems, carts } from "../../models/cart.model";
import AppError from "../../utils/AppError";
import cakeTable from "../../models/cake.model";
import {
  checkExistingItem,
  findCakeById,
  findCartById,
} from "./cartDb.helper.service";

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
  const cake = await findCakeById(cakeId);

  // check if the item alrady exist in cartItems

  const existingItem = await checkExistingItem(cakeId);

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
  const cart = await findCakeById(userId);

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
  const cart = await findCartById(userId);

  const cartItem = await checkExistingItem(cakeId);

  // if quantity is 1 remove item
  if (cartItem.quantity === 1) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));

    throw new AppError("Item remove from the cart", 400);
  }

  // find cake price
  const cake = await findCakeById(cakeId);

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
  const cart = await findCartById(userId);

  // check the existing item
  await checkExistingItem(cakeId);

  // remove item
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.cakeId, cakeId)));
};

export const clearCartService = async (userId: string) => {
  const cart = await findCartById(userId);

  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
};
