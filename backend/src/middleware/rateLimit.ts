import rateLimit from "express-rate-limit";
import { RequestHandler } from "express";

const isDev = process.env.NODE_ENV !== "production";

// In development, skip all rate limiting so local testing isn't blocked.
const passThrough: RequestHandler = (_req, _res, next) => next();

export const generalLimiter: RequestHandler = isDev
  ? passThrough
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Too many requests, please try again later." },
    });

export const aiProcessLimiter: RequestHandler = isDev
  ? passThrough
  : rateLimit({
      windowMs: 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Too many AI processing requests. Max 10 per minute." },
    });
