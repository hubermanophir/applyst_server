import { Request, Response } from "express";
import { generateToken, verifyToken } from "../utils/jwt.util";
import prisma from "../services/prisma.service";
import passwords from "../utils/passwords.util";
import { ENUM_JWT_EXPIRE } from "../types/jwt.types";

export const loginHandler = async (req: Request, res: Response, _: any) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findFirst({ where: { username } });

    if (!user || !passwords.comparePasswords(password, user.password_hash)) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }
    const { id: uid } = user;
    const [accessToken, refreshToken] = [
      generateToken({ uid }, ENUM_JWT_EXPIRE.ACCESS),
      generateToken({ uid }, ENUM_JWT_EXPIRE.REFRESH),
    ];
    res.status(204).json({ accessToken, refreshToken });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: { username },
    });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }
    const passwordHash = passwords.hashPassword(password);
    const newUser = await prisma.user.create({
      data: { username, password_hash: passwordHash },
    });
    const { id: uid } = newUser;
    const [accessToken, refreshToken] = [
      generateToken({ uid }, ENUM_JWT_EXPIRE.ACCESS),
      generateToken({ uid }, ENUM_JWT_EXPIRE.REFRESH),
    ];
    res.status(201).json({ accessToken, refreshToken });
    return;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint failed")
    ) {
      res.status(409).json({ message: "User already exists" });
      return;
    }
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const getAccessToken = (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authentication token is missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  const { uid } = verifyToken<{ uid: number }>(token);

  const newAccessToken = generateToken({ uid }, ENUM_JWT_EXPIRE.ACCESS);

  return res.status(200).json({ accessToken: newAccessToken });
};

//TODO: implement logout using redis to save the refresh token
export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ message: "Authentication token is missing or malformed" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const { uid } = verifyToken<{ uid: number }>(token);
    const user = await prisma.user.findFirst({ where: { id: uid } });
    if (!user) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
  res.status(204).json({ message: "Logged out successfully" });
  return;
};
