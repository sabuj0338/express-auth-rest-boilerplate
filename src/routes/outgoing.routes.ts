import express from "express";
import { allOutgoing, mockOutgoing, outgoingReports } from "../controllers/outgoing.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, allOutgoing);
router.get("/reports", authMiddleware, outgoingReports);
router.get("/mock", authMiddleware, mockOutgoing);

export default router;
