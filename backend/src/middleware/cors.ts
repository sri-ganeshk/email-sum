import cors from "cors";
import { config } from "../config";

export const corsMiddleware = cors({
  origin: config.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
