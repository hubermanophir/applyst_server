import jwt from "jsonwebtoken";
import { ENUM_JWT_EXPIRE } from "../types/jwt.types";

const SECRET_KEY = process.env.JWT_SECRET || "secret";

export const generateToken = (payload: object, expiresIn: ENUM_JWT_EXPIRE) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

export const verifyToken = <T>(token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY) as T;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
