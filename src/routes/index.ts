import express from 'express';
//import user from './user';
//import event from './event';

const router = express.Router();
router.get('/',(req,res)=>{console.log('ok')})

//router.use('/user', user);
//outer.use('/event', event);

export default router;
