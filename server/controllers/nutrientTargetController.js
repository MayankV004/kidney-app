import NutrientTarget from "../models/nutrientTarget-model.js";

export const getNutrientTarget = async (req, res) => {
  try {
    let nutrientTargets = await NutrientTarget.findOne({
      userId: req.user.userId,
    });

    if (!nutrientTargets) {
      // Create default targets if none exist
      nutrientTargets = new NutrientTarget({ userId: req.user.userId });
      await nutrientTargets.save();
    }

    res.json(nutrientTargets);
  } catch (error) {
    console.error("Get nutrient targets error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateNutrientTarget = async (req, res) => {
  try {
    const updates = { ...req.body, updatedAt: new Date() };

    const nutrientTargets = await NutrientTarget.findOneAndUpdate(
      { userId: req.user.userId },
      updates,
      { new: true, upsert: true }
    );

    res.json({
      message: "Nutrient targets updated successfully",
      nutrientTargets,
    });
  } catch (error) {
    console.error("Update nutrient targets error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
