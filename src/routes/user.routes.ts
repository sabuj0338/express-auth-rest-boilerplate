import express from "express";
import { createNewUser } from "../controllers/user.controller";
import { validateRegistration } from "../middlewares/authValidate.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";

const router = express.Router();

router.post("/create", validateRegistration, validateRequest, createNewUser);

export default router;
