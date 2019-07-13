import 'dotenv/config';
import express from 'express';
import CarController from '../../controllers/CarController';
import ImageHandler from '../../helpers/ImageHandler';
import JwtHandler from '../../helpers/JwtHandler';

const router = express.Router();

router.use('/', ImageHandler.configureStorage);
router.post('/', JwtHandler.authorize, ImageHandler.upload, CarController.create);
router.get('/', CarController.getCars);
router.get('/:id', CarController.get);
router.delete('/:id', JwtHandler.authorize, CarController.remove);
router.patch('/:id/status', JwtHandler.authorize, CarController.updateStatus);
router.patch('/:id/price', JwtHandler.authorize, CarController.updatePrice);

export default router;
