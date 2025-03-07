import express from "express";
import { allTeams, mockTeams } from "../controllers/team.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, allTeams);
router.get("/mock", authMiddleware, mockTeams);

export default router;
