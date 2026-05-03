import type { RequestHandler } from "express";
const allRouteError: RequestHandler = (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `can't find path ${req.originalUrl} on this server`,
  });
};

export default allRouteError;
