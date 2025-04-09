import mongoose from "mongoose";
import logger from "../utils/logger";
import env from "./env";

export const connectMongoDB = async (): Promise<mongoose.Mongoose> => {
  try {
    const connection = await mongoose.connect(
      env.mongoose.url,
      env.mongoose.options as mongoose.ConnectOptions
    );
    logger.info("MongoDB connected successfully");
    return connection;
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const closeMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  } catch (error) {
    logger.error("MongoDB connection close error:", error);
    process.exit(1);
  }
};

// SIGINT: close connection when you press Ctrl+C in the terminal.
process.on("SIGINT", async () => {
  await closeMongoDB();
  process.exit(0);
});

// SIGTERM: A generic signal often used by process managers (like Docker, systemd, PM2) to request termination.
process.on("SIGTERM", async () => {
  await closeMongoDB();
  process.exit(0);
});

