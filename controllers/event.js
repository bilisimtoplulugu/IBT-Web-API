import mongoose from 'mongoose';

import User from '../models/user';
import Event from '../models/event';
import UserEventMapping from '../models/userEventMapping';

import toSeoUrl from '../utils/toSeoUrl';
import {client as redisClient} from '../server';

export const pastController = async (req, res) => {
  try {
    const pastEvents = await Event.find({date: {$lt: new Date()}}).sort({
      date: -1,
    });

    if (!pastEvents)
      return res.status(404).send('Could not find a past event :(');
    redisClient.setex('pastEvents', 3600, JSON.stringify(pastEvents));

    return res.send(pastEvents);
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const nearController = async (req, res) => {
  try {
    const nearEvents = await Event.find({date: {$gt: new Date()}}).sort({
      date: 1,
    });

    if (!nearEvents)
      return res.status(404).send('Could not find a near event :(');
    redisClient.setex('nearEvents', 3600, JSON.stringify(nearEvents));

    return res.send(nearEvents);
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const allParticipantsController = async (req, res) => {
  const {eventUrl: seoUrl} = req.query;

  const event = await Event.findOne({seoUrl})
    .select({
      participants: 1,
    })
    .populate('participants', 'username name surname');

  if (!event) return res.status(404).send('Event not found!');

  let {participants} = event;
  if (!participants.length) return res.status(404).send('No any participant.');

  /* bad practice */

  const participantsIDS = participants.map((participant) => participant._id);

  const userEventMappings = await UserEventMapping.find({
    eventId: event._id,
    userId: {$in: participantsIDS},
  });

  participants = participants.map((participant) =>
    userEventMappings.map((userEventMapping) => {
      if (userEventMapping.userId.toString() == participant._id) {
        const {_doc: doc} = {...participant};
        doc.joinedAt = userEventMapping.joinedAt;
        return doc;
      }
    })
  );
  
  /* bad practice */

  return res.send(participants);
};

export const eventController = async (req, res) => {
  const {eventUrl: seoUrl} = req.params;

  // todo: can i get all participants count (just count) and put event object here?
  const event = await Event.findOne({seoUrl}).populate({
    path: 'participants',
    select: {name: 1, surname: 1, username: 1},
    options: {limit: 8},
  });

  if (!event) return res.status(404).send('Event not found!');
  redisClient.setex(seoUrl, 3600, JSON.stringify(event));

  res.send(event);
};

export const generateController = async (req, res) => {
  const {title} = req.body;

  if (!title) return res.status(400).send('You must fill all fields.');

  const seoUrl = toSeoUrl(title);

  // todo - question : should i keep cache count data?
  const existingControl = await Event.countDocuments({seoUrl});
  if (existingControl)
    return res.status(400).send('Event is already exist with this title.');

  req.body._id = mongoose.Types.ObjectId();
  req.body.seoUrl = toSeoUrl(title);
  const generatedEvent = await Event.create(req.body);

  res.send(generatedEvent);
};

export const joinController = async (req, res) => {
  // todo cache here??? ---
  const {userId, eventId, eventUrl, username} = req.body;

  if (!userId || !eventId)
    return res.status(400).send('You must fill all fields.');

  const event = await Event.findById(eventId).select({participants: 1});
  const user = await User.findById(userId).select({joinedEvents: 1});

  if (!event) return res.status(404).send('Event could not found.');
  if (!user) return res.status(404).send('User could not found.');

  await user.joinedEvents.push(eventId);
  await event.participants.push(userId);
  user.save();
  event.save();

  const _id = mongoose.Types.ObjectId();
  UserEventMapping.create({
    _id,
    userId: user._id,
    eventId: event._id,
  });

  res.send();
};

export const unjoinController = async (req, res) => {
  const {userId, eventId, eventUrl, username} = req.body;
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

  /* remove from also usermapping */

  res.send();
};
