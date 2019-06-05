import express from 'express';
import authRoutes from './authRoutes';

const router = express.Router();

router.use('/auth/signup', authRoutes);

export default router;
