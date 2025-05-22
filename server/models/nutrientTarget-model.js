import mongoose from 'mongoose';

const nutrientTargetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  protein: { type: Number, default: 60 },
  calories: { type: Number, default: 2000 },
  carbohydrates: { type: Number, default: 300 },
  fats: { type: Number, default: 65 },
  potassium: { type: Number, default: 2000 },
  phosphorus: { type: Number, default: 800 },
  sodium: { type: Number, default: 2000 },
  calcium: { type: Number, default: 1000 },
  magnesium: { type: Number, default: 300 },
  water: { type: Number, default: 2000 },
  updatedAt: { type: Date, default: Date.now }
});

const NutrientTarget = mongoose.model('NutrientTarget', nutrientTargetSchema);
export default NutrientTarget;