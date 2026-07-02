import { Router } from 'express';
import { AgentsController } from './agents.controller';
import { validate } from '../../middlewares/validate';
import { authenticate, authorize } from '../../middlewares/auth';
import { applyAgentSchema, verifyAgentSchema } from './agents.validation';

const router = Router();

router.get('/', AgentsController.listAgents);
router.post('/apply', authenticate, validate(applyAgentSchema), AgentsController.applyAgent);
router.get('/:id', AgentsController.getAgent);
router.put('/:id/verify', authenticate, authorize('ADMIN'), validate(verifyAgentSchema), AgentsController.verifyAgent);

export default router;
