import asyncHandler from "../utils/asyncHandler";
import {
  createOrderService,
  getMyOrdersService,
  getOrderByIdService,
} from "../services/order/order.service";
import AppError from "../utils/AppError";

export const createOrder = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const { recipientName, phone, address, city } = req.body;

  const order = await createOrderService(userId, {
    recipientName,
    phone,
    address,
    city,
  });

  res.status(201).json({ status: "successfull", id: order.id });
});

export const getMyOders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await getMyOrdersService(userId);

  res
    .status(200)
    .json({ status: "successfull", totalOrders: orders.length, data: orders });
});

export const getOrders = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const orderId = req.params.orderId as string;
  if (!orderId) {
    return next(new AppError("Order id not found", 404));
  }
  const orders = getOrderByIdService(userId, orderId);

  res.status(200).json({ status: "successfull", data: orders });
});
