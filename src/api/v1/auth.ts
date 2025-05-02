import { Router } from "express";
import {
  getAccessToken,
  loginHandler,
  logout,
  register,
} from "../../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", loginHandler);
authRouter.post("/refresh", getAccessToken);
authRouter.post("/logout", logout);
authRouter.post("/register", register);

export default authRouter;
