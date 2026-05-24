import express from "express";
import morgan from "morgan";
import cakeRouter from "./routes/cake.routes";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import cartRouter from "./routes/cart.route";
import allRouteError from "./middlewares/catchRouteError";
import handleGlobalError from "./controllers/error.controller";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { apiLimiter, authLimiter } from "./middlewares/rateLimiter";
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

//errors
app.use(allRouteError);
app.use(handleGlobalError);

export default app;
