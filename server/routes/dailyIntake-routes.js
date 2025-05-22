import express from "express";
import authenticateToken from "../middleware/auth.js";
import {
  createDailyIntake,
  getDailyIntake,
} from "../controllers/dailyIntakeController.js";

const router = express.Router();

router.get("/", authenticateToken, getDailyIntake);
router.post("/", authenticateToken, createDailyIntake);

export default router;
