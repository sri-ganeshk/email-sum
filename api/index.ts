import express from "express";
import app from "../backend/src/app";
import { connectDB } from "../backend/src/db/mongoose";

// One promise per cold start — warm requests reuse the existing connection
const dbReady = connectDB();

const vercelApp = express();

// Await DB before handling any request
vercelApp.use(async (_req, res, next) => {
  try {
    await dbReady;
    next();
  } catch (err) {
    console.error("Database connection failed:", err);
    return res.status(503).json({ error: "Service temporarily unavailable" });
  }
});

// Vercel routes /api/* here; mounting under /api lets Express see /* (strips the prefix)
vercelApp.use("/api", app);

export default vercelApp;
