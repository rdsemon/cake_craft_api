import * as z from "zod";

export const updateUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, { error: "name must be longer then 3 characters" })
      .max(20, { error: "name shoud not be longer then 20 characters" })
      .trim()
      .optional(),
    email: z.email().optional(),
    image: z.string().optional(),
    publicId: z.string().optional(),
  }),
});

export type updateUserBody = z.infer<typeof updateUserSchema>["body"];
