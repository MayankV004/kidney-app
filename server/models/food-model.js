import mongoose from 'mongoose';
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['VEGETABLES', 'FRUITS', 'GRAINS', 'PROTEIN', 'DAIRY', 'BEVERAGES', 'SNACKS', 'OTHER']
  },
  servingSize: { type: Number, required: true },
  servingSizeUnit: { type: String, required: true },
  nutrients: {
    protein: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 },
    phosphorus: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    calcium: { type: Number, default: 0 },
    magnesium: { type: Number, default: 0 },
    water: { type: Number, default: 0 }
  },
  isKidneyFriendly: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Food = mongoose.model('Food', foodSchema);
export default Food;
