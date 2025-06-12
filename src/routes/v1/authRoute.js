import { Router } from 'express';
import catchAsync from '~/utils/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import authValidation from '~/validations/authValidation';
import authController from '~/controllers/authController';

const router = Router();

router.post('/signup', validate(authValidation.signup), catchAsync(authController.signup));
router.post('/signin', validate(authValidation.signin), catchAsync(authController.signin));
router.get('/current', authenticate(), catchAsync(authController.current));
router.get('/me', authenticate(), catchAsync(authController.getMe));
router.put('/me', authenticate(), validate(authValidation.updateMe), catchAsync(authController.updateMe));
router.post('/signout', validate(authValidation.signout), catchAsync(authController.signout));
router.post('/refresh-tokens', validate(authValidation.refreshTokens), catchAsync(authController.refreshTokens));

// 🎯 Добавленные руты для подтверждения почты
router.post('/send-verification-email', authenticate(), catchAsync(authController.sendVerificationEmail));
router.get('/verify-email', catchAsync(authController.verifyEmail));

router.post('/forgot-password', validate(authValidation.forgotPassword), catchAsync(authController.forgotPassword));
router.post('/reset-password', validate(authValidation.resetPassword), catchAsync(authController.resetPassword));

export default router;
