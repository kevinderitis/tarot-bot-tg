import { Router } from 'express';
import { chat, refreshChat } from '../controllers/gptController.js';

const gptRouter = Router();

gptRouter.post('/assistant', chat);
gptRouter.get('/refresh', refreshChat);

export default gptRouter;
