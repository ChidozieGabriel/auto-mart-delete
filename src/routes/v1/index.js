import express from 'express';
import authRoutes from './authRoutes';
import carRoutes from './carRoutes';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/car', carRoutes);

export default router;
