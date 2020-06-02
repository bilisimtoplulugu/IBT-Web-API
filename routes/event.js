/* Packages I used */
import express from 'express';
import Event from '../models/event';
import User from '../models/user';
import toSeoUrl from '../utils/toSeoUrl';

const router = express.Router(); // call express.Router function to provide route

router.get('/near', async (req, res) => {
  // this router should return nearby events

  try {
    const nearEvents = await Event.find();
    return res.send(nearEvents);
  } catch (error) {
    return res.status(400).send(error);
  }

  //const x = await Event.find({date: {$gt: new Date()}});
  //res.send(generatedEvent);
});

/* DEPRECATED */
/* router.get('/e/:eventId', async (req, res) => {
  const {eventId} = req.params;
  const event = await Event.findById(eventId);
  res.send(event);
}); */

router.get('/:seoUrl', async (req, res) => {
  // event exist validation
  const {seoUrl} = req.params;

  const event = await Event.findOne({seoUrl}, {participants: {$slice: 8}});

  if (!event) return res.status(404).send('Event not found!');

  const participantsDetails = await User.find({
    _id: {$in: event.participants},
  });

  res.json({event, participants: participantsDetails});
});

router.post('/generate', async (req, res) => {
  const {title} = req.body;

  if (!title) return res.status(400).send('You must fill all fields.');

  req.body.seoUrl = toSeoUrl(title);
  const generatedEvent = await Event.create(req.body);

  res.send(generatedEvent);
});

router.patch('/join', async (req, res) => {
  const {userId, eventId} = req.body;

  if (!userId || !eventId)
    return res.status(400).send('You must fill all fields.');

  const event = await Event.findById(eventId);
  const user = await User.findById(userId).select({joinedEvents: 1});

  if (!event) return res.status(404).send('Event could not found.');
  if (!user) return res.status(404).send('User could not found.');

  await user.joinedEvents.push(eventId);
  await event.participants.push(userId);
  user.save();
  event.save();

  res.send();
});

router.patch('/unjoin', async (req, res) => {
  const {userId, eventId} = req.body;
  if (!userId || !eventId)
    return res.status(400).send('You must fill all fields.');

  const event = await Event.findById(eventId);
  const user = await User.findById(userId).select({joinedEvents: 1});

  if (!event) return res.status(404).send('Event could not found.');
  if (!user) return res.status(404).send('User could not found.');

  await user.joinedEvents.remove(eventId);
  await event.participants.remove(userId);
  user.save();
  event.save();

  res.send();
});

export default router;
