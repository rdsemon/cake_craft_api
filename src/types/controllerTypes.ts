import AppError from "../utils/AppError.js";
import { ZodError } from "zod";

//error controller types
export type DatabaseError = Error & {
  detail?: string;
  column?: string;
  cause?: { code: string };
};

export type ErrorType = (AppError | ZodError | DatabaseError | Error) & {
  status?: string;
  statusCode?: number;
  message: string;
  name?: string;
};

//getCakeController types

export interface GetCakesOptions {
  search?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  sort?: "price-asc" | "price-desc" | "title";
  page?: string | number;
  limit?: string | number;
}

export interface CartItem {
  cakeId: string;
  quantity: number;
  subtotal: number | null;
  unitPrice: number;
}
