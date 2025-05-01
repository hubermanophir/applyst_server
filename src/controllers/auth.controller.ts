import { Request, Response } from "express";
import { ENUM_JWT_EXPIRE, generateToken } from "../utils/jwt";
import prisma from "../services/prisma.service";
import passwords from "../utils/passwords";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findFirst({ where: { username } });

    if (!user || !passwords.comparePasswords(password, user.password_hash)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const { id: uid } = user;
    const [accessToken, refreshToken] = [
      generateToken({ uid }, ENUM_JWT_EXPIRE.ACCESS),
      generateToken({ uid }, ENUM_JWT_EXPIRE.REFRESH),
    ];

    res.cookie("Access-Token", accessToken, { httpOnly: true });
    res.cookie("Refresh-Token", refreshToken, { httpOnly: true });
    return res.status(204).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.locals.user = null;
  return res.json({ message: "Logout successful" });
};
