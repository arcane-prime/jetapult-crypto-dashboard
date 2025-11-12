import express from 'express';
import cryptoRoutes from './crypto.routes.js';
import authRoutes from './auth.routes.js';

const router = express.Router();

// Health check
router.get('/ping', (req, res) => {
  res.send('pong');
});

// Crypto routes
router.use('/crypto', cryptoRoutes);
router.use('/auth', authRoutes);

export default router;

