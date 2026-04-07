import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./middleware/cors";
import { generalLimiter } from "./middleware/rateLimit";
import authRoutes from "./routes/auth.routes";
import emailRoutes from "./routes/email.routes";
import calendarRoutes from "./routes/calendar.routes";

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.options("*", corsMiddleware);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(generalLimiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "backend", timestamp: new Date().toISOString() });
});

app.use("/auth", authRoutes);
app.use("/emails", emailRoutes);
app.use("/calendar", calendarRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
