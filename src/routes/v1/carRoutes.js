import 'dotenv/config';
import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import uploadImageHandler from '../../helpers/uploadImageHandler';
import CarController from '../../controllers/CarController';

const router = express.Router();

router.use('/', multer({ storage: multer.memoryStorage() }).single('photo'));

router.use('/', (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  next();
});

router.post('/', uploadImageHandler, CarController.create);

router.get('/', CarController.getCars);

router.get('/:id', CarController.get);

router.delete('/:id', CarController.remove);

router.patch('/:id/status', CarController.updateStatus);

router.patch('/:id/price', CarController.updatePrice);

export default router;
