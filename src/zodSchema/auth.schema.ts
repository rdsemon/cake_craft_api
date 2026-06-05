import * as z from "zod";
import { validateHtml } from "./zod.helper.js";

export const signUpSchema = z.object({
  body: z
    .object({
      name: validateHtml("Name")
        .min(3, { error: "name must be longer than 3 characters" })
        .max(20, { error: "name shoud not be longer than 20 characters" })
        .trim(),
      email: z.email().toLowerCase(),
      role: z.enum(["customer", "admin"]).optional(),
      password: z
        .string()
        .min(6, { error: "password must be at least 6 characters" }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      error: "Password dose not match",
      path: ["confirmPassword"],
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z
      .string()
      .min(6, { error: "password must be at least 6 characters" }),
  }),
});

export type signUpBody = z.infer<typeof signUpSchema>["body"];
export type loginBody = z.infer<typeof loginSchema>["body"];
