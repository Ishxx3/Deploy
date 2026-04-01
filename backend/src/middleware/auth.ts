import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  sub: string;
  email: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "Configuration serveur" });
  }
  try {
    const payload = jwt.verify(token, secret) as AuthPayload;
    (req as Request & { auth?: AuthPayload }).auth = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Session invalide" });
  }
}
