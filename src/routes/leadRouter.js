import { Router } from 'express';
import { getAll, updateLead } from '../controllers/leadController.js';

const leadRouter = Router();

leadRouter.get('/', getAll);
leadRouter.put('/:id', updateLead);

export default leadRouter;
