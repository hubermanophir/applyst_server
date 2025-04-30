import { Request, Response } from "express";
import { generateToken } from "../utils/jwt.util";

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === "testuser" && password === "password123") {
    const token = generateToken({ username });
    res.cookie("Access-Token", token, { httpOnly: true }); // Set the token as an HTTP-only cookie
    return res.json({ message: "Login successful", token });
  }

  return res.status(401).json({ message: "Invalid username or password" });
};
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.locals.user = null;
  return res.json({ message: "Logout successful" });
};
