import mongoose from 'mongoose';
const Schema = mongoose.Schema;

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
  participants: [String],
  guests: [String],
  moderator: String,
  isOnline: Boolean,
  organizer: String,
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
