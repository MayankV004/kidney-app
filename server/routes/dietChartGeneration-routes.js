import express from 'express';
import authenticateToken from '../middleware/auth.js';
import { createDietChart } from '../controllers/dietChartController.js';


const router = express.Router();

router.post('/', authenticateToken,createDietChart)



export default router;