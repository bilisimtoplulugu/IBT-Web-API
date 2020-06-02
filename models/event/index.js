import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: String,
  subtitle: String,
  seoUrl: String,
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
  address: String,
  participants: [String],
  guests: [String],
  moderator: String,
  isOnline: Boolean,
  organizer: String,
});

export default mongoose.model('event', EventSchema);
