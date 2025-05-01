import { Router } from "express";
import userRouter from "./users";
import authRouter from "./auth";

const v1Router = Router();

v1Router.use("/users", userRouter);
v1Router.use("/auth", authRouter);

export default v1Router;
