/* Packages I used */
import express from 'express';
import Event from '../models/event';
import User from '../models/user';

const router = express.Router(); // call express.Router function to provide route

router.get('/near', async (req, res) => {
  // need some validations
  const x = await Event.find().sort({_id:-1}).limit(6);
  console.log(x.reverse())
  //res.send(generatedEvent);
});

router.get('/:eventId', async (req, res) => {
  // event exist validation
  const {eventId} = req.params;
  const event = await Event.findById(eventId);
  const participantsDetails = await User.find({
    username: {$in: event.participants},
  });
  event.participants = participantsDetails;
  res.send(event);
});

router.post('/generate', async (req, res) => {
  // need some validations
  const generatedEvent = await Event.create(req.body);
  res.send(generatedEvent);
});

router.patch('/join', async (req, res) => {
  // error handling need
  const {username, eventId} = req.body;
  const event = await Event.findById(eventId);
  event.participants.push(username);
  event.save();
  res.send('saved');
});

export default router;
