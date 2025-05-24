import express from "express";
import authenticateToken from "../middleware/auth.js";
import {
  createMeal,
  getMeal,
  updateMeal,
  deleteMeal,
} from "../controllers/mealController.js";

import Meal from "../models/meal-model.js";

const router = express.Router();

router.get("/", authenticateToken, getMeal);
router.post("/", authenticateToken, createMeal);
router.post("/add-food", authenticateToken, async (req, res) => {
  try {
    const { foodId, quantity, mealId } = req.body;
    
    if (mealId) {
      // Add to existing meal
      const meal = await Meal.findOneAndUpdate(
        { _id: mealId, userId: req.user.userId },
        { $push: { foods: { food: foodId, quantity } } },
        { new: true }
      ).populate("foods.food");
      
      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }
      
      res.json({ message: "Food added to meal successfully", meal });
    } else {
      // Create new meal with food
      const mealData = {
        ...req.body.mealData,
        userId: req.user.userId,
        foods: [{ food: foodId, quantity }]
      };
      
      const meal = new Meal(mealData);
      await meal.save();
      
      const populatedMeal = await Meal.findById(meal._id).populate("foods.food");
      res.status(201).json({ message: "Meal created successfully", meal: populatedMeal });
    }
  } catch (error) {
    console.error("Add food to meal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", authenticateToken, updateMeal);
router.delete("/:id", authenticateToken, deleteMeal);

export default router;
