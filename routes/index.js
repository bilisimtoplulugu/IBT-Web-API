/* Packages I used */
import express from 'express';
import user from './user';
import event from './event';

const router = express.Router(); // call express.Router function to provide route

router.use('/user', user);
router.use('/event', event);

export default router;
