import nodemailer from "nodemailer";
import env from "../config/env";
import logger from "../utils/logger";

export const transport = nodemailer.createTransport(env.email.smtp);

const connectSMTP = async (): Promise<void> => {
  try {
    await transport.verify();
    logger.info("Connected to email server");
  } catch (error) {
    logger.error("Unable to connect to email server error:", error);
    process.exit(1);
  }
};

export default connectSMTP;
