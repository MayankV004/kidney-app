import NutrientTarget from '../models/nutrientTarget-model.js';
import User from '../models/user-model.js'

export const createDietChart = async (req, res) => {
  try {
    const { method, age } = req.body;
    const user = await User.findById(req.user.userId);
    
    let newTargets = {
      protein: 60,
      calories: 2000,
      carbohydrates: 300,
      fats: 65,
      potassium: 2000,
      phosphorus: 800,
      sodium: 2000,
      calcium: 1000,
      magnesium: 300,
      water: 2000,
    };

    switch (method) {
      case "AGE_BASED":
        if (age) {
          if (age < 30) {
            newTargets = {
              ...newTargets,
              protein: 70,
              calories: 2200,
              water: 2500,
            };
          } else if (age < 50) {
            newTargets = {
              ...newTargets,
              protein: 65,
              calories: 2000,
              water: 2300,
            };
          } else {
            newTargets = {
              ...newTargets,
              protein: 60,
              calories: 1800,
              water: 2000,
            };
          }
        }
        break;
       
      case "CKD_STAGE":
        if (user?.ckdStage) {
          switch (user.ckdStage) {
            case "STAGE_1":
              newTargets = {
                ...newTargets,
                protein: 80,
                potassium: 3000,
                phosphorus: 1000,
                sodium: 2300,
              };
              break;
            case "STAGE_2":
              newTargets = {
                ...newTargets,
                protein: 70,
                potassium: 2500,
                phosphorus: 900,
                sodium: 2000,
              };
              break;
            case "STAGE_3":
              newTargets = {
                ...newTargets,
                protein: 60,
                potassium: 2000,
                phosphorus: 800,
                sodium: 1500,
              };
              break;
            case "STAGE_4":
              newTargets = {
                ...newTargets,
                protein: 50,
                potassium: 1500,
                phosphorus: 700,
                sodium: 1300,
              };
              break;
            case "STAGE_5":
              newTargets = {
                ...newTargets,
                protein: 40,
                potassium: 1000,
                phosphorus: 600,
                sodium: 1000,
              };
              break;
          }
        }
        break;
    }
        
    // Update nutrient targets and get the updated document
    const dietChart = await NutrientTarget.findOneAndUpdate(
      { userId: req.user.userId },
      { ...newTargets, updatedAt: new Date() },
      { upsert: true, new: true } // new: true returns the updated document
    );

    // Update user with diet chart reference
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        dietChart: dietChart._id,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({
      message: "Diet chart generated successfully",
      targets: newTargets,
      dietChartId: dietChart._id
    });
    
  } catch (error) {
    console.error("Generate diet chart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};