import express from 'express';

import cache from '../middlewares/eventCache';
import {
  pastController,
  nearController,
  allParticipantsController,
  eventController,
  generateController,
  deleteController,
  joinController,
  unjoinController,
} from '../controllers/event';

const router = express.Router();

// event post request = generate event
router.post('/', cache, generateController);

router.delete('/', deleteController);

router.get('/past', cache, pastController);

router.get('/near', cache, nearController);

router.get('/all-participants', allParticipantsController);

router.get('/:eventUrl', cache, eventController);

router.patch('/join', cache, joinController);

router.patch('/unjoin', cache, unjoinController);

export default router;
