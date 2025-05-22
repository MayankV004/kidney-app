import express from 'express';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken , (req ,res)=>{
    res.json({
        status:'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    })
})

export default router;