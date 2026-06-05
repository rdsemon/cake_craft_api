import * as z from "zod";

export const validateHtml = (field: string) =>
  z
    .string()
    .refine(
      (value) => !/<[^>]+>/g.test(value),
      `${field} cannot contain HTML tags`,
    );
