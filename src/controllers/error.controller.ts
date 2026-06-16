import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import AppError from "../utils/AppError.js";
import type { DatabaseError } from "../types/dbType.js";

type ErrorType = (AppError | ZodError | DatabaseError | Error) & {
  status?: string;
  statusCode?: number;
  message: string;
  name?: string;
};

const sendErrorDev = (error: ErrorType, res: Response) => {
  res.status(error.statusCode || 500).json({
    status: error.status,
    err: error,
    stack: error.stack,
    message: error.message,
  });
};

const sendErrorProd = (error: ErrorType, res: Response) => {
  if (error instanceof AppError && error.isOperational) {
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

const handleJwtExpireError = (error: Error): AppError =>
  new AppError(`${error.message}. Please login again`, 401);

const handleJwtError = () =>
  new AppError("Invalid token. Please login again", 401);

const handleZodError = (error: ZodError) => {
  const message = error.issues.map((issue) => issue.message).join(", ");

  return new AppError(message, 400);
};

const handleDuplicateError = (error: DatabaseError): AppError => {
  const field = error.detail?.match(/\((.*?)\)/)?.[1];

  return new AppError(`${field || "Email"} already exists`, 409);
};

const handleForeignKeyError = (): AppError =>
  new AppError("Referenced resource does not exist", 400);

const handleNotNullError = (error: DatabaseError): AppError => {
  return new AppError(`${error.column} is required`, 400);
};

const handleGlobalError = (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  err.message = err.message || "Something went wrong";
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === "production") {
    let error: ErrorType = err;
    const dbError = error as DatabaseError;

    // JWT
    if (error.name === "TokenExpiredError") {
      error = handleJwtExpireError(error as Error);
    }

    if (error.name === "JsonWebTokenError") {
      error = handleJwtError();
    }

    // Zod
    if (err instanceof ZodError) {
      error = handleZodError(err);
    }

    // PostgreSQL / Drizzle
    if (dbError?.cause?.code === "23505") {
      error = handleDuplicateError(error as DatabaseError);
    }

    if (dbError?.cause?.code === "23503") {
      error = handleForeignKeyError();
    }

    if (dbError?.cause?.code === "23502") {
      error = handleNotNullError(error as DatabaseError);
    }

    sendErrorProd(error, res);
  }
};

export default handleGlobalError;
