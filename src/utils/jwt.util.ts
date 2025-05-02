import jwt from "jsonwebtoken";
import { ENUM_JWT_EXPIRE } from "../types/jwt.types";

const accessTokenSecret = process.env.TOKEN_SECRET || "default";
const refreshTokenSecret = process.env.REFRESH || "default";

export enum TokenType {
  accessToken = 0,
  refreshToken = 1,
}

export const generateToken = (
  payload: object,
  expiresIn: ENUM_JWT_EXPIRE,
  tokenSecret: TokenType
) => {
  return jwt.sign(
    payload,
    tokenSecret ? refreshTokenSecret : accessTokenSecret,
    { expiresIn }
  );
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
