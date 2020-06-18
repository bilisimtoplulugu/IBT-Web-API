import mongoose from 'mongoose';
const {Schema} = mongoose;

export default new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  sentAt: {
    type: Date,
    default: Date.now(),
  },
  body: String,
  /* sub comment */
});
