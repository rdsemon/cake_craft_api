import { desc, eq } from "drizzle-orm";
import { orders, orderItems } from "../../models/order.model.js";
import { carts, cartItems } from "../../models/cart.model.js";
import cakeTable from "../../models/cake.model.js";

import AppError from "../../utils/AppError.js";
import db from "../../database.js";

export const createOrderService = async (
  userId: string,
  payload: {
    recipientName: string;
    phone: string;
    address: string;
    city: string;
  },
) => {
  return db.transaction(async (tx: any) => {
    const [cart] = await tx
      .select()
      .from(carts)
      .where(eq(carts.userId, userId));

    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    const items = await tx
      .select({
        cakeId: cartItems.cakeId,
        quantity: cartItems.quantity,
        subtotal: cartItems.price,
        unitPrice: cakeTable.price,
      })
      .from(cartItems)
      .innerJoin(cakeTable, eq(cartItems.cakeId, cakeTable.id))
      .where(eq(cartItems.cartId, cart.id));

    if (items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    const totalAmount = items.reduce(
      (acc: any, item: any) => acc + Number(item.subtotal),
      0,
    );

    const [order] = await tx
      .insert(orders)
      .values({
        userId,
        totalAmount: totalAmount.toString(),
        recipientName: payload.recipientName,
        phone: payload.phone,
        address: payload.address,
        city: payload.city,
      })
      .returning();

    await tx.insert(orderItems).values(
      items.map((item: any) => ({
        orderId: order.id,
        cakeId: item.cakeId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
    );

    await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));

    return order;
  });
};

export const getMyOrdersService = async (userId: string) => {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
};

export const getOrderByIdService = async (userId: string, orderId: string) => {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  const items = await db
    .select({
      id: orderItems.id,
      cakeId: orderItems.cakeId,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      subtotal: orderItems.subtotal,
      cakeName: cakeTable.title,
    })
    .from(orderItems)
    .innerJoin(cakeTable, eq(orderItems.cakeId, cakeTable.id))
    .where(eq(orderItems.orderId, orderId));

  return {
    ...order,
    items,
  };
};
