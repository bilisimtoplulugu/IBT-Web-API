import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: String,
  subtitle: String,
  seoUrl: String,
  description: String,
  date: String,
  time: String,
  imagePath: {
    type: String,
    default: `/assets/images/image${Date.now()}.png`,
  },
  address: String,
  participants: [String],
  guests: [String],
  moderator: String,
  isOnline: Boolean,
  organizer: String,
});

export default mongoose.model('event', EventSchema);
