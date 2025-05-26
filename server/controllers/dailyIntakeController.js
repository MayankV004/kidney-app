import DailyIntake from "../models/dailyIntake-model.js";
import Meal from "../models/meal-model.js"; 
export const getDailyIntake = async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;

    let query = { userId: req.user.userId };

    if (date) {
      query.date = date;
    } else if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.date = { $gte: thirtyDaysAgo.toISOString().split("T")[0] };
    }

    const dailyIntakes = await DailyIntake.find(query)
      .populate({
        path: "meals",
        populate: {
          path: "foods.food",
        },
      })
      .sort({ date: -1 });

    res.json(dailyIntakes);
  } catch (error) {
    console.error("Get daily intake error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createDailyIntake = async (req, res) => {
  try {
    const { mealId, date } = req.body;
    const today = date || new Date().toISOString().split("T")[0];

    // Get the meal with populated foods
    const meal = await Meal.findById(mealId).populate("foods.food");
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    // Calculate meal nutrients
    const mealNutrients = meal.foods.reduce(
      (total, { food, quantity }) => {
        return {
          protein: total.protein + food.nutrients.protein * quantity,
          calories: total.calories + food.nutrients.calories * quantity,
          carbohydrates:
            total.carbohydrates + food.nutrients.carbohydrates * quantity,
          fats: total.fats + food.nutrients.fats * quantity,
          potassium: total.potassium + food.nutrients.potassium * quantity,
          phosphorus: total.phosphorus + food.nutrients.phosphorus * quantity,
          sodium: total.sodium + food.nutrients.sodium * quantity,
          calcium: total.calcium + food.nutrients.calcium * quantity,
          magnesium: total.magnesium + food.nutrients.magnesium * quantity,
          water: total.water + (meal.waterIntake || 0),
        };
      },
      {
        protein: 0,
        calories: 0,
        carbohydrates: 0,
        fats: 0,
        potassium: 0,
        phosphorus: 0,
        sodium: 0,
        calcium: 0,
        magnesium: 0,
        water: meal.waterIntake || 0,
      }
    );

    // Find or create daily intake
    let dailyIntake = await DailyIntake.findOne({
      userId: req.user.userId,
      date: today,
    });

    if (dailyIntake) {
      // Update existing
      dailyIntake.meals.push(mealId);

      // Add to total nutrients
      Object.keys(mealNutrients).forEach((key) => {
        dailyIntake.totalNutrients[key] += mealNutrients[key];
      });
    } else {
      // Create new
      dailyIntake = new DailyIntake({
        userId: req.user.userId,
        date: today,
        meals: [mealId],
        totalNutrients: mealNutrients,
      });
    }

    await dailyIntake.save();

    const populatedDailyIntake = await DailyIntake.findById(
      dailyIntake._id
    ).populate({
      path: "meals",
      populate: {
        path: "foods.food",
      },
    });

    res.json({
      message: "Meal added to daily intake successfully",
      dailyIntake: populatedDailyIntake,
    });
  } catch (error) {
    console.error("Add to daily intake error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
