import express from 'express';
import user from './user';
import event from './event';

const router = express.Router();

router.use('/user', user);
router.use('/event', event);

export default router;
