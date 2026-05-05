import * as z from "zod";

export const updateUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, { error: "name must be longer then 3 characters" })
      .max(20, { error: "name shoud not be longer then 20 characters" })
      .trim(),
    email: z.email(),
  }),
});

export type updateUserBody = z.infer<typeof updateUserSchema>["body"];
