import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 200,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many API requests",
  },
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  limit: 5,

  standardHeaders: true,
  legacyHeaders: false,

  skipSuccessfulRequests: true,

  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
});

export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 3,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Action temporarily blocked.",
  },
});
