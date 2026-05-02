class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  status: string;

  constructor(message: string, stausCode: number) {
    super(message);
    this.statusCode = stausCode;
    this.isOperational = true;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
