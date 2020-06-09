import mongoose from 'mongoose';
const {Schema,model} = mongoose;

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
  eventLink: String,
});

const Event = model('Event', eventSchema);
export default Event;
