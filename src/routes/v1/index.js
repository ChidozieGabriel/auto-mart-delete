import express from 'express';
import authRoutes from './authRoutes';
import carRoutes from './carRoutes';
import orderRoutes from './orderRoutes';
import JwtHandler from '../../helpers/JwtHandler';

const router = express.Router();

router.get('/', (req, res) => res.json({
  message: "Welcome to Auto-Mart API version 1.0. Access API docs through '/api-docs'",
}));

router.use('/auth', authRoutes);

router.use('/car', JwtHandler.authorize, carRoutes);

// router.use('/order', JwtHandler.authorize, orderRoutes);

export default router;
