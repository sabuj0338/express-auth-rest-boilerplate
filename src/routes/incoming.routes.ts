import express from "express";
import { allIncoming, mockIncoming } from "../controllers/incoming.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, allIncoming);
router.get("/mock", authMiddleware, mockIncoming);

export default router;
