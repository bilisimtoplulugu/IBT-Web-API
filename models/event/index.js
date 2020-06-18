import mongoose from 'mongoose';
const {Schema, model} = mongoose;

import commentSchema from './comment'

const eventSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  subtitle: String,
  seoUrl: String,
  description: String,
  date: Date,
  publishedDate: {
    type: Date,
    default: Date.now(),
  },
  address: String,
  participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  participantLimit: Number,
  guests: [String], /*  make an external collection */
  moderator: String,
  isOnline: Boolean,
  organizer: String,
  eventLink: String,
  comments:[commentSchema]
});

const Event = model('Event', eventSchema);
export default Event;
