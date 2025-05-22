import express from "express";
import authenticateToken from "../middleware/auth.js";
import {
  createMeal,
  getMeal,
  updateMeal,
  deleteMeal,
} from "../controllers/mealController.js";

const router = express.Router();

router.get("/", authenticateToken, getMeal);
router.post("/", authenticateToken, createMeal);

router.put("/:id", authenticateToken, updateMeal);
router.delete("/:id", authenticateToken, deleteMeal);

export default router;
