import express, { Router } from "express";
import Role from "../../config/roles";
import { auth, authController, authValidation } from "../../modules/auth";
import { validate } from "../../modules/validate";

const router: Router = express.Router();

router.post("/register", validate(authValidation.register), authController.register);
router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", validate(authValidation.logout), authController.logout);
router.post("/refresh-tokens", validate(authValidation.refreshTokens), authController.refreshTokens);
router.post("/forgot-password", validate(authValidation.forgotPassword), authController.forgotPassword);
router.post("/reset-password", validate(authValidation.resetPassword), authController.resetPassword);
router.post("/send-verification-email", auth(Role.all), authController.sendVerificationEmail);
router.post("/verify-email", validate(authValidation.verifyEmail), authController.verifyEmail);

export default router;
