import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

const validateInput =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
    });

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((el: any) => el.message)
        .join(" , ");

      return next(new AppError(errorMessage, 400));
    }

    const { body, params } = result.data;

    req.body = body;
    req.params = params;

    next();
  };

export default validateInput;
