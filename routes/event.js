/* Packages I used */
import express from 'express';
import Event from '../models/event';
import User from '../models/user';
import toSeoUrl from '../utils/toSeoUrl';

const router = express.Router(); // call express.Router function to provide route

router.get('/near', async (req, res) => {
  // need some validations

  const nearEvents = await Event.find().sort({date: 1});
  res.send(nearEvents);

  //const x = await Event.find({date: {$gt: new Date()}});
  //res.send(generatedEvent);
});

router.get('/e/:eventId',async(req,res)=>{
  const {eventId} = req.params;
  const event = await Event.findById(eventId);
  res.send(event)
})

router.get('/:seoUrl', async (req, res) => {
  // event exist validation
  const {seoUrl} = req.params;
  console.log(seoUrl);
  const event = await Event.findOne({seoUrl});
  if (!event) return res.status(404).send('Event not found!');
  const participantsDetails = await User.find({
    _id: {$in: event.participants},
  });
  res.json({event, participants: participantsDetails});
});

router.post('/generate', async (req, res) => {
  const {title} = req.body;
  // need some validations
  req.body.seoUrl = toSeoUrl(title);
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
