/* Packages I used */
import express from 'express';
import mongoose from 'mongoose';

import Event from '../models/event';
import User from '../models/user';
import toSeoUrl from '../utils/toSeoUrl';

const router = express.Router(); // call express.Router function to provide route

router.get('/past', async (req, res) => {
  try {
    const pastEvents = await Event.find({date: {$lt: new Date()}});
    return res.send(pastEvents);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get('/near', async (req, res) => {
  try {
    const nearEvents = await Event.find({date: {$gt: new Date()}});
    return res.send(nearEvents);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get('/all-participants', async (req, res) => {
  const {eventUrl} = req.query;

  const event = await Event.findOne({seoUrl: eventUrl}).select({
    participants: 1,
  });

  if (!event) return res.status(404).send('Event not found!');

  const participantsDetails = await User.find({
    _id: {$in: event.participants},
  }).select({username: 1, name: 1, surname: 1});

  res.send(participantsDetails);
});

router.get('/:eventUrl', async (req, res) => {
  const {eventUrl} = req.params;

  const event = await Event.findOne(
    {seoUrl: eventUrl},
    {participants: {$slice: 8}}
  );

  if (!event) return res.status(404).send('Event not found!');

  /* todo: populate here */
  const participantsDetails = await User.find({
    _id: {$in: event.participants},
  });

  res.json({event, participants: participantsDetails});
});

router.post('/generate', async (req, res) => {
  const {title} = req.body;

  if (!title) return res.status(400).send('You must fill all fields.');

  const seoUrl = toSeoUrl(title);
  const event = Event.count({seoUrl});
  /* todo: event exist with this name ocntrol */

  req.body._id = mongoose.Types.ObjectId();
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
