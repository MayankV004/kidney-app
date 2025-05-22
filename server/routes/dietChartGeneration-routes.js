import express from 'express';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken)



export default router;