import express from "express";
import morgan from "morgan";
import cakeRouter from "./routes/cake.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.routes.js";
import allRouteError from "./middlewares/catchRouteError.js";
import handleGlobalError from "./controllers/error.controller.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { apiLimiter, authLimiter } from "./middlewares/rateLimiter.js";
const app = express();

app.use(express.json({ limit: "120kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());

//rate limit
app.use("/api/v1/", apiLimiter);
app.use("/api/v1/auth", authLimiter);

//routes
app.use("/api/v1", cakeRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", cartRouter);
app.use("/api/v1", orderRouter);

//errors
app.use(allRouteError);
app.use(handleGlobalError);

export default app;
