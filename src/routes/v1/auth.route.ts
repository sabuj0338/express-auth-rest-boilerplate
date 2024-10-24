import express, { Router } from "express";
import { auth, authValidation, authController } from "../../modules/auth";
import Role from "../../config/roles";
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

// router.post("/register", authValidation.register, validationHandler, authController.register);

// router.post("/login", authValidation.login, validationHandler, authController.login);

// router.post("/logout", auth(Role.all), authController.logout);

// router.post("/send-otp", authValidation.sendOTP, validationHandler, authController.sendOTP);

// router.post("/verify-otp", authValidation.otpVerify, validationHandler, authController.verifyOTP);

// router.get("/profile", auth(Role.all), authController.profile);

// router.put("/update", auth(Role.all), authValidation.profileUpdate, validationHandler, authController.update);

// router.put("/update-photo", auth(Role.all), authValidation.profilePhotoUpdate, validationHandler, authController.updatePhoto);

// router.put("/update-password", authValidation.passwordUpdate, validationHandler, authController.updatePassword);

export default router;
