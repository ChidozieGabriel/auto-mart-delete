import express from 'express';
import FlagController from '../../controllers/FlagController';

const router = express.Router();
router.post('/', FlagController.create);

export default router;
