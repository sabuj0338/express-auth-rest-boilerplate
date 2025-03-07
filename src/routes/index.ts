import express from "express";
import authRoutes from "./auth.routes";
import incomingRoutes from "./incoming.routes";
import outgoingRoutes from "./outgoing.routes";
import teamRoutes from "./team.routes";
import userRoutes from "./user.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/teams", teamRoutes);
router.use("/outgoings", outgoingRoutes);
router.use("/incomings", incomingRoutes);

export default router;
