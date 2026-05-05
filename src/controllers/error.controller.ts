import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

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
    return res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message });
  }

  console.log(error);

  res.status(500).json({ status: "error", message: "something went wrong" });
};

const handleJwtExpireError = (error: any) =>
  new AppError(`${error.message} please login again`, 401);

const handleGlobalError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.message = err.message || "something went wrong";
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;

    if (error.name === "TokenExpiredError") {
      error = handleJwtExpireError(error);
    }
    sendErrorProd(error, res);
  }
};

export default handleGlobalError;
