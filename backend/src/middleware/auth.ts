import { Request, Response, NextFunction } from "express";
import { googleService } from "../services/google.service";

export interface AuthenticatedRequest extends Request {
  accessToken?: string;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    // Verify the token is still valid by checking with Google
    await googleService.verifyToken(token);
    req.accessToken = token;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired access token" });
  }
}
