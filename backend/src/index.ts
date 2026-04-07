import "dotenv/config";
import app from "./app";
import { config } from "./config";
import { connectDB } from "./db/mongoose";

connectDB().then(() => {
  app.listen(config.PORT, () => {
    console.log(`Backend running on http://localhost:${config.PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
  });
});
