import express from "express";
import authenticateToken from "../middleware/auth.js";
import {
  getFavoriteFoods,
  getUserProfile,
  updateUserProfile,
  addFavoriteFood,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);

router.get("/favorites", authenticateToken, getFavoriteFoods);
router.post("/favorites", authenticateToken, addFavoriteFood);

export default router;
