import express, { Application } from "express";
import cookieParser from "cookie-parser";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import apiRouter from "./api";
import { jwtMiddleware } from "./middlewares/auth.middleware";
import { notFoundHandler } from "./controllers/notFound";
import cors from "cors";

const app: Application = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(loggerMiddleware);

app.use("/api", (req, res, next) => {
  if (req.path.startsWith("/v1/auth")) {
    return next();
  }
  jwtMiddleware(req, res, next);
});

app.use("/api", apiRouter);

app.use(notFoundHandler);

export default app;
