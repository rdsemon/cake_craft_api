import express from "express";
import morgan from "morgan";
import cakeRouter from "./routes/cake.routes";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import allRouteError from "./middlewares/catchRouteError";
import handleGlobalError from "./controllers/error.controller";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json({ limit: "120kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1", cakeRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", userRouter);
app.use(allRouteError);
app.use(handleGlobalError);

export default app;
