import express from "express";
import authenticateToken from "../middleware/auth.js";
import {
  getNutrientTarget,
  updateNutrientTarget,
} from "../controllers/nutrientTargetController.js";

const router = express.Router();

router.get("/", authenticateToken, getNutrientTarget);
router.put("/", authenticateToken, updateNutrientTarget);

export default router;
