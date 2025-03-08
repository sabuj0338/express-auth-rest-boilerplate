import express from "express";
import { allIncoming, incomingReports, mockIncoming } from "../controllers/incoming.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, allIncoming);
router.get("/reports", authMiddleware, incomingReports);
router.get("/mock", authMiddleware, mockIncoming);

export default router;
