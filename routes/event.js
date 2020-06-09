import express from 'express';
import mongoose from 'mongoose';

import Event from '../models/event';
import User from '../models/user';
import toSeoUrl from '../utils/toSeoUrl';

const router = express.Router();

router.get('/past', async (req, res) => {
  try {
    const pastEvents = await Event.find({date: {$lt: new Date()}}).sort({date:1});
    return res.send(pastEvents);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get('/near', async (req, res) => {
  try {
    const nearEvents = await Event.find({date: {$gt: new Date()}}).sort({date:1});
    return res.send(nearEvents);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get('/all-participants', async (req, res) => {
  const {eventUrl:seoUrl} = req.query;

  const event = await Event.findOne({seoUrl}).select({
    participants: 1,
  });

  if (!event) return res.status(404).send('Event not found!');

  /* todo: populate here */
  const participantsDetails = await User.find({
    _id: {$in: event.participants},
  }).select({username: 1, name: 1, surname: 1});

  res.send(participantsDetails);
});

router.get('/:eventUrl', async (req, res) => {
  const {eventUrl:seoUrl} = req.params;

  const event = await Event.findOne(
    {seoUrl},
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

  const existingControl = await Event.count({seoUrl})
  if(existingControl) return res.status(400).send('Event is already exist with this title.');

  req.body._id = mongoose.Types.ObjectId();
  req.body.seoUrl = toSeoUrl(title);
  const generatedEvent = await Event.create(req.body); // make select here

  res.send(generatedEvent);
});

router.patch('/join', async (req, res) => {
  const {userId, eventId} = req.body;

  if (!userId || !eventId)
    return res.status(400).send('You must fill all fields.');

  const event = await Event.findById(eventId).select({participants:1});
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
