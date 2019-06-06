import express from 'express';
import OrderController from '../../controllers/OrderController';

const router = express.Router();

router.post('/', OrderController.create);

router.patch('/:id/price', OrderController.updatePrice);

export default router;
