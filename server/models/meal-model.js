import mongoose from 'mongoose';
const mealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  timeOfDay: String,
  waterIntake: { type: Number, default: 0 },
  foods: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    quantity: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Meal = mongoose.model('Meal', mealSchema);
export default Meal;