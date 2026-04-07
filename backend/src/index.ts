import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { connectDB } from "./db/mongoose";
import { corsMiddleware } from "./middleware/cors";
import { generalLimiter } from "./middleware/rateLimit";
import authRoutes from "./routes/auth.routes";
import emailRoutes from "./routes/email.routes";
import calendarRoutes from "./routes/calendar.routes";

const app = express();

// Security headers
app.use(helmet());
app.use(corsMiddleware);
app.options("*", corsMiddleware); // preflight

// Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Rate limiting
app.use(generalLimiter);

// Health check (no auth)
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "backend", timestamp: new Date().toISOString() });
});

// Routes
app.use("/auth", authRoutes);
app.use("/emails", emailRoutes);
app.use("/calendar", calendarRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

connectDB().then(() => {
  app.listen(config.PORT, () => {
    console.log(`Backend running on http://localhost:${config.PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
  });
});

export default app;
