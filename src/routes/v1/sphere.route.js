import { Router } from 'express';
import authenticate from '~/middlewares/authenticate';
import catchAsync from '~/utils/catchAsync';
import * as sphereController from '~/controllers/sphereController';

const router = Router();

router.get('/', authenticate(), catchAsync(sphereController.getMySpheres));
router.put('/', authenticate(), catchAsync(sphereController.createOrUpdateSphere));

export default router;
