import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    recipientName: z
      .string()
      .trim()
      .min(3, { error: "Name must be at least 3 characters long" })
      .max(20, { error: "Name cannot exceed 20 characters" }),

    phone: z
      .string()
      .trim()
      .regex(/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/, {
        error: "Invalid  phone number",
      }),

    address: z.string().trim().min(5, { error: "Address is required" }),

    city: z.string().trim().min(2, { error: "City is required" }),
  }),
});
