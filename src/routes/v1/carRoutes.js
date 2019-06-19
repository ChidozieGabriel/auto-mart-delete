import 'dotenv/config';
import express from 'express';
import CarController from '../../controllers/CarController';
import ImageHandler from '../../helpers/ImageHandler';

const router = express.Router();

router.use('/', ImageHandler.configureStorage);
router.post('/', ImageHandler.upload, CarController.create);
router.get('/', CarController.getCars);
router.get('/:id', CarController.get);
router.delete('/:id', CarController.remove);
router.patch('/:id/status', CarController.updateStatus);
router.patch('/:id/price', CarController.updatePrice);

export default router;
