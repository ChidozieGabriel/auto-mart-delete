import express from 'express';
import UserController from '../../controllers/UserController';

const router = express.Router();

router.post('/signup', UserController.signUp);

router.post('/signin', UserController.signIn);

export default router;
