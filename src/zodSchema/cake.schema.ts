import * as z from "zod";
import { validateHtml } from "./zod.helper.js";

export const createCakeSchema = z.object({
  body: z.object({
    title: validateHtml("Title")
      .min(5, { error: "Title must be longer than 5 characters" })
      .max(100, { error: "Title should not be longer than 100 characters" })
      .trim(),

    description: validateHtml("Description")
      .min(6, { error: "Description must be longer than 20 characters" })
      .trim(),

    price: z.number().positive({ error: "Price must be greater than 0" }),

    inStock: z
      .number()
      .int({ error: "In stock must be an integer" })
      .nonnegative({ error: "In stock cannot be negative" }),

    coverImage: z.url().optional(),

    userId: z.string(),
  }),
});

export const updateCakeSchema = z.object({
  body: z
    .object({
      title: validateHtml("Title")
        .min(5, { error: "Title must be longer than 5 characters" })
        .max(100, { error: "Title should not be longer than 100 characters" })
        .trim()
        .optional(),

      description: validateHtml("Description")
        .min(6, { error: "Description must be longer than 20 characters" })
        .trim()
        .optional(),

      price: z
        .number()
        .positive({ error: "Price must be greater than 0" })
        .optional(),

      inStock: z
        .number()
        .int({ error: "In stock must be an integer" })
        .nonnegative({ error: "In stock cannot be negative" })
        .optional(),

      coverImage: z.url().optional().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),

  params: z.object({
    id: z.uuid(),
  }),
});

export type CreateCakeBody = z.infer<typeof createCakeSchema>["body"];
export type UpdateCakeBody = z.infer<typeof updateCakeSchema>["body"];
