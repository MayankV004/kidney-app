import mongoose from 'mongoose';

const favoriteFoodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  createdAt: { type: Date, default: Date.now }
});
const FavoriteFood = mongoose.model('FavoriteFood', favoriteFoodSchema);
export default FavoriteFood;