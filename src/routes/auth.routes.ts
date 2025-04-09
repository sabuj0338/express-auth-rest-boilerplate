import express from "express";
import {
  forgotPassword,
  login,
  logout,
  refreshTokens,
  register,
  resetPassword,
  sendVerificationEmail,
  updateProfile,
  verifyEmail,
  whoAmI,
} from "../controllers/auth.controller";
import { acp } from "../middlewares/auth.middleware";
import {
  vForgotPassword,
  vLogin,
  vLogout,
  vRefreshToken,
  vRegistration,
  vResetPassword,
  vUpdatePassword,
  vUpdateProfile,
  vVerifyEmail,
} from "../middlewares/authValidate.middleware";
import { vr } from "../middlewares/validateRequest.middleware";

const router = express.Router();

router.post("/register", vRegistration, vr, register);
router.post("/login", vLogin, vr, login);
router.post("/logout", vLogout, vr, logout);
router.post("/refresh-tokens", vRefreshToken, vr, refreshTokens);
router.post("/forgot-password", vForgotPassword, vr, forgotPassword);
router.post("/reset-password", vResetPassword, vr, resetPassword);
router.post("/send-verification-email", acp, sendVerificationEmail);
router.post("/verify-email", acp, vVerifyEmail, vr, verifyEmail);
router.put("/update", vUpdateProfile, vr, acp, updateProfile);
router.put("/update-password", vUpdatePassword, vr, acp, updateProfile);
router.get("/whoami", acp, whoAmI);

export default router;
