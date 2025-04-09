import nodemailer from "nodemailer";
import env from "../config/env";
import logger from "../utils/logger";

export interface Message {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Sends an email using the configured SMTP transport.
 * It establishes a connection, sends the email, and closes the connection.
 * If an error occurs during connection or sending, it logs the error
 * and throws it to be handled by the caller.
 *
 * @param to Recipient email address.
 * @param subject Email subject line.
 * @param text Plain text body of the email.
 * @param html HTML body of the email.
 * @throws {Error} If connection to the email server fails or sending the email fails.
 */
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<void> => {
  // Create a new transport object for each email attempt
  // This ensures connections are managed per-send operation
  const transport = nodemailer.createTransport(env.email.smtp);
  let connectionVerified = false;

  try {
    // Verify the connection to the SMTP server
    await transport.verify();
    logger.info("Successfully connected to email server.");
    connectionVerified = true; // Mark connection as verified

    // Construct the email message
    const msg: Message = {
      from: env.email.from,
      to,
      subject,
      text,
      html,
    };

    // Send the email
    await transport.sendMail(msg);
    logger.info(`Email sent successfully to ${to}`);
  } catch (error) {
    // Log the specific error encountered
    if (!connectionVerified) {
      logger.error("Failed to connect to the email server:", error);
    } else {
      logger.error(`Failed to send email to ${to}:`, error);
    }
    // Re-throw the error to allow the caller to handle it
    // This replaces process.exit(1)
    throw new Error(
      `Email service failed: ${(error as Error).message || error}`
    );
  } finally {
    // Close the connection if it was successfully established,
    // regardless of whether sending succeeded or failed afterwards.
    if (connectionVerified) {
      transport.close();
      logger.info("SMTP connection closed.");
    }
  }
};

export const sendResetPasswordEmail = async (
  to: string,
  token: string
): Promise<void> => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${env.clientUrl}/reset-password?token=${token}`;
  const text = `Hi,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>To reset your password, click on this link: ${resetPasswordUrl}</p>
  <p>If you did not request any password resets, please ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

export const sendResetPasswordEmailByOTP = async (
  to: string,
  otp: number
): Promise<void> => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const text = `Hi,
  To reset your password, use this OTP: ${otp}
  If you did not request any password resets, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>To reset your password, use this OTP: <span style="padding: 4px 8px;background-color: #f1f5f9; border-radius: 3px;">${otp}</span></p>
  <p>If you did not request any password resets, please ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

export const sendVerificationEmailByOTP = async (
  to: string,
  otp: number,
  name: string
): Promise<void> => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const text = `Hi ${name},
  To verify your email, use this OTP: ${otp}
  If you did not create an account, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>To verify your email, use this OTP: <span style="padding: 4px 8px;background-color: #f1f5f9; border-radius: 3px;">${otp}</span></p>
  <p>If you did not create an account, then ignore this email.</p></div>`;
  await sendEmail(to, subject, text, html);
};

export const sendVerificationEmail = async (
  to: string,
  token: string,
  name: string
): Promise<void> => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://${env.clientUrl}/verify-email?token=${token}`;
  const text = `Hi ${name},
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
  <p>If you did not create an account, then ignore this email.</p></div>`;
  await sendEmail(to, subject, text, html);
};

export const sendSuccessfulRegistration = async (
  to: string,
  token: string,
  name: string
): Promise<void> => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://${env.clientUrl}/verify-email?token=${token}`;
  const text = `Hi ${name},
  Congratulations! Your account has been created. 
  You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

export const sendAccountCreated = async (
  to: string,
  name: string
): Promise<void> => {
  const subject = "Account Created Successfully";
  // replace this url with the link to the email verification page of your front-end app
  const loginUrl = `http://${env.clientUrl}/auth/login`;
  const text = `Hi ${name},
  Congratulations! Your account has been created successfully. 
  You can now login at: ${loginUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created successfully.</p>
  <p>You can now login at: ${loginUrl}</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};
