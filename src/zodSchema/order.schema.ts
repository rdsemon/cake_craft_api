import { z } from "zod";
import { validateHtml } from "./zod.helper.js";

export const createOrderSchema = z.object({
  body: z.object({
    recipientName: validateHtml("Name")
      .trim()
      .min(3, { error: "Name must be at least 3 characters long" })
      .max(20, { error: "Name cannot exceed 20 characters" }),

    phone: z
      .string()
      .trim()
      .regex(/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/, {
        error: "Invalid  phone number",
      }),

    address: validateHtml("Address")
      .trim()
      .min(5, { error: "Address is required" }),

    city: validateHtml("City").trim().min(2, { error: "City is required" }),
  }),
});
