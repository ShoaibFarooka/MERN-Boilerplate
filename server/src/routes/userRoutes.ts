import { Router } from 'express';
import * as controller from '../controllers/userController';
import * as authMiddleware from '../middleware/authMiddleware';
import * as userSchemas from '../validationSchemas/userSchemas';
import * as validationMiddleware from '../middleware/validationMiddleware';

const router = Router();

router.post(
  '/:userType-register',
  validationMiddleware.validateParams(userSchemas.userTypeSchema),
  validationMiddleware.validateRequest(userSchemas.registerSchema),
  controller.Register
);

router.post(
  '/login',
  validationMiddleware.validateRequest(userSchemas.loginSchema),
  controller.Login
);

router.post(
  '/forgot-password',
  validationMiddleware.validateRequest(userSchemas.forgotPasswordSchema),
  controller.ForgotPassword
);

router.post(
  '/reset-password',
  validationMiddleware.validateRequest(userSchemas.resetPasswordSchema),
  controller.ResetPassword
);

router.post(
  '/refresh-token',
  controller.RefreshToken
);

router.post(
  '/logout',
  controller.Logout
);

router.get(
  '/fetch-user-info',
  authMiddleware.authenticateRequest,
  controller.FetchUserInfo
);

router.patch(
  '/update-user-info',
  authMiddleware.authenticateRequest,
  validationMiddleware.validateRequest(userSchemas.updateUserSchema),
  controller.UpdateUserInfo
);

router.patch(
  '/change-user-password',
  authMiddleware.authenticateRequest,
  validationMiddleware.validateRequest(userSchemas.changeUserPasswordSchema),
  controller.ChangeUserPassword
);

export default router;
