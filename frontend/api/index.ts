import express from "express";
import app from "../../backend/src/app";
import { connectDB } from "../../backend/src/db/mongoose";

// One promise per cold start — warm requests reuse the existing connection
const dbReady = connectDB();

const vercelApp = express();

// Await DB before handling any request
vercelApp.use(async (_req, _res, next) => {
  await dbReady;
  next();
});

// Vercel routes /api/* here; mounting under /api lets Express see /* (strips the prefix)
vercelApp.use("/api", app);

export default vercelApp;
