import express from 'express';

import cache from '../middleware/eventCache';
import {
  pastController,
  nearController,
  allParticipantsController,
  eventController,
  generateController,
  joinController,
  unjoinController,
} from '../controllers/event';

const router = express.Router();

router.get('/past', cache, pastController);

router.get('/near', cache, nearController);

router.get('/all-participants', allParticipantsController);

router.get('/:eventUrl', cache, eventController);

router.post('/generate', cache, generateController);

router.patch('/join', cache, joinController);

router.patch('/unjoin', cache, unjoinController);

export default router;
