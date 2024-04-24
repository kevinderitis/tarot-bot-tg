import { Router } from 'express';
import { webhook } from '../controllers/stripeController.js';

const stripeRouter = Router();

stripeRouter.post('/webhook', webhook);

export default stripeRouter;
