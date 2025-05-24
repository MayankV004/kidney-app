import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  weight: Number,
  height: Number,
  ckdStage: {
    type: String,
    enum: ['STAGE_1', 'STAGE_2', 'STAGE_3', 'STAGE_4', 'STAGE_5'],
  },
  medicalConditions: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  dietChart:{type:mongoose.Schema.ObjectId,ref:'NutrientTarget'}
});

const User = mongoose.model('User', userSchema);

export default User;