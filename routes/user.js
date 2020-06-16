import express from 'express';

import cache from '../middlewares/userCache';
import {
  allJoinedEventsController,
  usernameController,
  registerController,
  loginController,
  authController,
  sendCodeToEmailController,
  emailVerificationController,
  changePasswordController,
  changePersonalController,
  changeProfilePhotoController,
} from '../controllers/user';

const router = express.Router();

router.get('/all-joined-events', cache, allJoinedEventsController);

router.get('/:username', cache, usernameController);

router.post('/register', registerController);

router.post('/login', loginController);

router.post('/auth', authController);

router.post('/send-code-to-email', sendCodeToEmailController);

router.post('/email-verification', emailVerificationController);

router.patch('/change-password', changePasswordController);

router.patch('/change-personal', cache, changePersonalController);

router.patch('/change-profile-photo', changeProfilePhotoController);

export default router;
