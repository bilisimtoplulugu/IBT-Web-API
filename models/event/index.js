import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: String,
  subtitle: String,
  description: String,
  date: String,
  time: String,
  imagePath: String,
  address: String,
  participants: [String],
});

export default mongoose.model('event', EventSchema);