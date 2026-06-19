import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";
import type { ZodType } from "zod";

const validateInput =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
    });

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((el) => el.message)
        .join(" , ");

      return next(new AppError(errorMessage, 400));
    }

    const { body, params } = result.data as Record<string, unknown>;

    req.body = body;
    req.params = params as Record<string, string>;

    next();
  };

export default validateInput;
