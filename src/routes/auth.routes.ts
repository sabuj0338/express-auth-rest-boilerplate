import express from "express";
import {
  forgotPassword,
  login,
  logout,
  refreshTokens,
  register,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import {
  validateForgotPassword,
  validateLogin,
  validateLogout,
  validateRefreshToken,
  validateRegistration,
  validateResetPassword,
  validateVerifyEmail,
} from "../middlewares/authValidate.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";

const router = express.Router();

router.post("/register", validateRegistration, validateRequest, register);

router.post("/login", validateLogin, validateRequest, login);

router.post("/logout", validateLogout, validateRequest, logout);

router.post(
  "/refresh-tokens",
  validateRefreshToken,
  validateRequest,
  refreshTokens
);
router.post(
  "/forgot-password",
  validateForgotPassword,
  validateRequest,
  forgotPassword
);
router.post(
  "/reset-password",
  validateResetPassword,
  validateRequest,
  resetPassword
);
router.post(
  "/send-verification-email",
  authMiddleware,
  sendVerificationEmail
);
router.post(
  "/verify-email",
  authMiddleware,
  validateVerifyEmail,
  validateRequest,
  verifyEmail
);

export default router;
