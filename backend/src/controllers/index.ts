import express from 'express';
import cryptoController from './crypto.controller.js';
import authController from './auth.controller.js';

const router = express.Router();

router.get('/ping', (req, res) => {
  res.send('pong');
});

router.use('/crypto', cryptoController);
router.use('/auth', authController);

export default router;

