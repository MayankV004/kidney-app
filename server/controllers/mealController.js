import Meal from "../models/meal-model.js";

export const getMeal = async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.user.userId })
      .populate("foods.food")
      .sort({ createdAt: -1 });

    res.json(meals);
  } catch (error) {
    console.error("Get meals error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createMeal = async (req, res) => {
  try {
    const mealData = {
      ...req.body,
      userId: req.user.userId,
    };

    const meal = new Meal(mealData);
    await meal.save();

    const populatedMeal = await Meal.findById(meal._id).populate("foods.food");
    res
      .status(201)
      .json({ message: "Meal created successfully", meal: populatedMeal });
  } catch (error) {
    console.error("Create meal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    ).populate("foods.food");

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.json({ message: "Meal updated successfully", meal });
  } catch (error) {
    console.error("Update meal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Delete meal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
