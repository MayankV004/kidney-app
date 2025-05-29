import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth-routes.js';
import userRoutes from './routes/user-favorite-routes.js'
import foodRoutes from './routes/food-routes.js'
import mealRoutes from './routes/meal-routes.js'
import dailyIntakeRoutes from './routes/dailyIntake-routes.js'
import nutrientTargetRoutes from './routes/nutrientTarget-routes.js'
import dietChartGenerationRoutes from './routes/dietChartGeneration-routes.js'
import healthRoutes from './routes/health-routes.js'

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

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/foods' , foodRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/daily-intake', dailyIntakeRoutes);
app.use('/api/nutrient-targets', nutrientTargetRoutes);
app.use('/api/generate-diet-chart', dietChartGenerationRoutes);
app.use('/api/health' , healthRoutes);


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
});