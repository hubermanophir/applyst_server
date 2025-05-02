import { Router } from "express";
import { getUsers } from "../../controllers/users.controller";

const userRouter = Router();

userRouter.get("/", getUsers);

export default userRouter;
