import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import AppError from "../utils/AppError.js";

const sendErrorDev = (error: any, res: Response) => {
  res.status(error.statusCode || 500).json({
    status: error.status,
    err: error,
    stack: error.stack,
    message: error.message,
  });
};

const sendErrorProd = (error: any, res: Response) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

const handleJwtExpireError = (error: any) =>
  new AppError(`${error.message}. Please login again`, 401);

const handleJwtError = () =>
  new AppError("Invalid token. Please login again", 401);

const handleZodError = (error: ZodError) => {
  const message = error.issues.map((issue) => issue.message).join(", ");

  return new AppError(message, 400);
};

const handleDuplicateError = (error: any) => {
  const field = error.detail?.match(/\((.*?)\)/)?.[1];

  return new AppError(`${field || "Email"} already exists`, 409);
};

const handleForeignKeyError = () =>
  new AppError("Referenced resource does not exist", 400);

const handleNotNullError = (error: any) => {
  return new AppError(`${error.column} is required`, 400);
};

const handleGlobalError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.message = err.message || "Something went wrong";
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === "production") {
    let error = err;

    // JWT
    if (error.name === "TokenExpiredError") {
      error = handleJwtExpireError(error);
    }

    if (error.name === "JsonWebTokenError") {
      error = handleJwtError();
    }

    // Zod
    if (err instanceof ZodError) {
      error = handleZodError(err);
    }

    // PostgreSQL / Drizzle

    if (error?.cause?.code === "23505") {
      error = handleDuplicateError(error);
    }

    if (error?.cause?.code === "23503") {
      error = handleForeignKeyError();
    }

    if (error?.cause?.code === "23502") {
      error = handleNotNullError(error);
    }

    sendErrorProd(error, res);
  }
};

export default handleGlobalError;
