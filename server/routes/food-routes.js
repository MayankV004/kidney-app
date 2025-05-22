import express from "express";
import authenticateToken from "../middleware/auth.js";
import { createFood, getAllFood } from "../controllers/foodController.js";

const router = express.Router();

router.get("/", authenticateToken, getAllFood);
router.post("/", authenticateToken, createFood);

export default router;
