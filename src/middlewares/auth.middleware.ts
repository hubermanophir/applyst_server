import { Request, Response, NextFunction } from "express";
import { TokenType, verifyToken } from "../utils/jwt.util";

export const jwtMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ message: "Authentication token is missing or malformed" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const { uid } = verifyToken<{ uid: number }>(token, TokenType.accessToken);
    (req as Request & { uid: number }).uid = uid;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
