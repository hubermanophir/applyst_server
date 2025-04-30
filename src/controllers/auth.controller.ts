import { Request, Response } from "express";
import { ENUM_JWT_EXPIRE, generateToken } from "../utils/jwt.util";
import prisma from "../services/prisma.service";

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;
  prisma.user.findFirst({});

  if (username === "testuser" && password === "password123") {
    const accessToken = generateToken({ username }, ENUM_JWT_EXPIRE.ACCESS);
    const refreshToken = generateToken({ username }, ENUM_JWT_EXPIRE.REFRESH);
    res.cookie("Access-Token", accessToken, { httpOnly: true });
    res.cookie("Refresh-Token", refreshToken, { httpOnly: true });
    return res.json({ message: "Login successful" });
  }

  return res.status(401).json({ message: "Invalid username or password" });
};
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.locals.user = null;
  return res.json({ message: "Logout successful" });
};
