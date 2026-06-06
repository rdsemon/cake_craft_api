import * as z from "zod";
import { validateHtml } from "./zod.helper.js";

export const updateUserSchema = z.object({
  body: z.object({
    name: validateHtml("Name")
      .min(3, { error: "name must be longer then 3 characters" })
      .max(20, { error: "name shoud not be longer then 20 characters" })
      .trim()
      .optional(),
    email: z.email().optional(),
    image: z.string().optional(),
    publicId: z.string().optional(),
  }),
  params: z.object({
    id: z.string({ error: "id is required" }),
  }),
});

export type updateUserBody = z.infer<typeof updateUserSchema>["body"];
