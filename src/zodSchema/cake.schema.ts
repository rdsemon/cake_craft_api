import * as z from "zod";

export const createCakeSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(5, { error: "Title must be longer than 5 characters" })
      .max(100, { error: "Title should not be longer than 100 characters" })
      .trim(),

    description: z
      .string()
      .min(6, { error: "Description must be longer than 20 characters" })
      .trim(),

    price: z.number().positive({ error: "Price must be greater than 0" }),

    inStock: z
      .number()
      .int({ error: "In stock must be an integer" })
      .nonnegative({ error: "In stock cannot be negative" }),

    coverImage: z.url().optional(),
  }),
});

export const updateCakeSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(5, { error: "Title must be longer than 5 characters" })
      .max(100, { error: "Title should not be longer than 100 characters" })
      .trim()
      .optional(),

    description: z
      .string()
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
  }),

  params: z.object({
    id: z.string(),
  }),
});

export type CreateCakeBody = z.infer<typeof createCakeSchema>["body"];
