import { Request, Response } from "express";
import { generateToken, TokenType, verifyToken } from "../utils/jwt.util";
import prisma from "../services/prisma.service";
import passwords from "../utils/passwords.util";
import { ENUM_JWT_EXPIRE } from "../types/jwt.types";

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findFirst({ where: { username } });

    if (!user || !passwords.comparePasswords(password, user.password_hash)) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const { id: uid } = user;
    const [accessToken, refreshToken] = [
      generateToken({ uid }, ENUM_JWT_EXPIRE.ACCESS, TokenType.accessToken),
      generateToken({ uid }, ENUM_JWT_EXPIRE.REFRESH, TokenType.refreshToken),
    ];
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
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
      generateToken({ uid }, ENUM_JWT_EXPIRE.ACCESS, TokenType.accessToken),
      generateToken({ uid }, ENUM_JWT_EXPIRE.REFRESH, TokenType.refreshToken),
    ];
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ accessToken });
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

export const getAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token is missing" });
    return;
  }

  try {
    const { uid } = verifyToken<{ uid: number }>(
      refreshToken,
      TokenType.refreshToken
    );
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }
    const newAccessToken = generateToken(
      { uid },
      ENUM_JWT_EXPIRE.ACCESS,
      TokenType.accessToken
    );

    res.status(200).json({ accessToken: newAccessToken });
    return;
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
    return;
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
  return;
};
