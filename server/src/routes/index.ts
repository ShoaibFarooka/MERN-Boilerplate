import express from 'express';
import UserRoutes from './userRoutes';

const router = express.Router();

// Set up routes
router.use('/user', UserRoutes);

export default router;
