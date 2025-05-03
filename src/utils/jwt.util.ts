import jwt from "jsonwebtoken";
import { ENUM_JWT_EXPIRE } from "../types/jwt.types";
import dotenv from "dotenv";
dotenv.config();
const accessTokenSecret = process.env.TOKEN_SECRET || "default";
const refreshTokenSecret = process.env.REFRESH_TOKEN || "default";

export enum TokenType {
  accessToken = 0,
  refreshToken = 1,
}

export const generateToken = (
  payload: object,
  expiresIn: ENUM_JWT_EXPIRE,
  tokenSecret: TokenType
) => {
  const secret = tokenSecret ? refreshTokenSecret : accessTokenSecret;
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = <T>(token: string, tokenSecret: TokenType) => {
  try {
    return jwt.verify(
      token,
      tokenSecret ? refreshTokenSecret : accessTokenSecret
    ) as T;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
