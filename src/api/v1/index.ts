import { Router } from "express";
import userRouter from "./users.controller";

const v1Router = Router();

v1Router.use("/users", userRouter);

export default v1Router;
