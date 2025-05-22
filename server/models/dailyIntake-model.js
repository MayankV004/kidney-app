import mongoose from 'mongoose';
const dailyIntakeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD format
  meals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meal" }],
  totalNutrients: {
    protein: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 },
    phosphorus: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    calcium: { type: Number, default: 0 },
    magnesium: { type: Number, default: 0 },
    water: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

const DailyIntake = mongoose.model("DailyIntake", dailyIntakeSchema);
export default DailyIntake;
