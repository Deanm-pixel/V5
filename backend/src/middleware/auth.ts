import jwt from "jsonwebtoken";
import User from "../models/User";
import {Request, Response, NextFunction} from "express";

export interface AuthRequest extends Request {
  user?: any
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({message: "Kein Token"});
  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({message: "Token ungültig"});
  }
};

export const requireRole = (roles: ("admin" | "editor" | "user")[]) => 
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({message: "Nicht eingeloggt"});
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({message: "Keine Berechtigung"});
    }
    next();
  };
