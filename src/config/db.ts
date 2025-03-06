import mongoose from "mongoose";
import logger from "../utils/logger";
import env from "./env";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoose.url, env.mongoose.options as mongoose.ConnectOptions);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
