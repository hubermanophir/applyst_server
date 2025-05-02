import { Router } from "express";
import {
  getAccessToken,
  loginHandler,
  logout,
} from "../../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", loginHandler);
authRouter.post("/refresh", getAccessToken);
authRouter.post("/logout", logout);

export default authRouter;
