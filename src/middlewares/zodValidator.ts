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
      const formattedErrors: string = result.error.issues
        .map((issue) => {
          const filed = issue.path[1];
          const errorMessage =
            issue.code === "invalid_type" && issue.input === undefined
              ? `${String(filed)} field is missing`
              : issue.message;

          return errorMessage;
        })
        .join(", ");

      return next(new AppError(formattedErrors, 400));
    }

    const { body, params } = result.data as Record<string, unknown>;

    req.body = body;
    req.params = params as Record<string, string>;

    next();
  };

export default validateInput;
