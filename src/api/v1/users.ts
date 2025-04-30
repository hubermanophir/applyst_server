import { Router } from "express";
import { getUsers } from "../../controllers/users.controller";

const userRouter = Router();

// Define user-related routes
userRouter.get("/", getUsers);

userRouter.post("/", (req, res) => {
  res.send("Create a new user");
});

export default userRouter;
