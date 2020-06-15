import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const userEventMappingSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  eventId: {type: mongoose.Schema.Types.ObjectId, ref: 'Event'},
  joinedAt: {
      type:Date,
      default:Date.now()
  },
});

const UserEventMapping = model('UserEventMapping', userEventMappingSchema);
export default UserEventMapping;
