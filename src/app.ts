import express, { Application } from "express";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import apiRouter from "./api";

const app: Application = express();

// Middleware to parse JSON
app.use(express.json());

// Logger middleware
app.use(loggerMiddleware);

// Use the API router
app.use("/api", apiRouter);

export default app;
