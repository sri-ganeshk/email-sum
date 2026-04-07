import mongoose from "mongoose";
import { config } from "../config";

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.MONGODB_URI, { dbName: "ai-email-assistant" });
    console.log("MongoDB connected:", mongoose.connection.host);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
