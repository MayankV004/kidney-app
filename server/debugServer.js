import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use(limiter);

// Debug: Import routes one by one to find the problematic one
console.log('Loading authRoutes...');
try {
  const authRoutes = await import('./routes/auth-routes.js');
  app.use('/api/auth', authRoutes.default);
  console.log('✓ authRoutes loaded successfully');
} catch (error) {
  console.error('✗ Error loading authRoutes:', error.message);
}

console.log('Loading userRoutes...');
try {
  const userRoutes = await import('./routes/user-favorite-routes.js');
  app.use('/api/user', userRoutes.default);
  console.log('✓ userRoutes loaded successfully');
} catch (error) {
  console.error('✗ Error loading userRoutes:', error.message);
}

console.log('Loading foodRoutes...');
try {
  const foodRoutes = await import('./routes/food-routes.js');
  app.use('/api/foods', foodRoutes.default);
  console.log('✓ foodRoutes loaded successfully');
} catch (error) {
  console.error('✗ Error loading foodRoutes:', error.message);
}

console.log('Loading mealRoutes...');
try {
  const mealRoutes = await import('./routes/meal-routes.js');
  app.use('/api/meals', mealRoutes.default);
  console.log('✓ mealRoutes loaded successfully');
} catch (error) {
  console.error('✗ Error loading mealRoutes:', error.message);
}

console.log('Loading dailyIntakeRoutes...');
try {
  const dailyIntakeRoutes = await import('./routes/dailyIntake-routes.js');
  app.use('/api/daily-intake', dailyIntakeRoutes.default);
  console.log('✓ dailyIntakeRoutes loaded successfully');
} catch (error) {
  console.error('✗ Error loading dailyIntakeRoutes:', error.message);
}

console.log('Loading nutrientTargetRoutes...');
try {
  const nutrientTargetRoutes = await import('./routes/nutrientTarget-routes.js');
  app.use('/api/nutrient-targets', nutrientTargetRoutes.default);
  console.log('✓ nutrientTargetRoutes loaded successfully');
} catch (error) {
  console.error('✗ Error loading nutrientTargetRoutes:', error.message);
}

console.log('Loading dietChartGenerationRoutes...');
try {
  const dietChartGenerationRoutes = await import('./routes/dietChartGeneration-routes.js');
  app.use('/api/generate-diet-chart', dietChartGenerationRoutes.default);
  console.log('✓ dietChartGenerationRoutes loaded successfully');
} catch (error) {
  console.error('✗ Error loading dietChartGenerationRoutes:', error.message);
}

console.log('Loading healthRoutes...');
try {
  const healthRoutes = await import('./routes/health-routes.js');
  app.use('/api/health', healthRoutes.default);
  console.log('✓ healthRoutes loaded successfully');
} catch (error) {
  console.error('✗ Error loading healthRoutes:', error.message);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  const { seedFoods } = await import('./seed.js');
  await seedFoods();
});