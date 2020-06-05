import mongoose from 'mongoose';
/* import PermissionSchema from './permission'; */
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  surname: String,
  username: String,
  password: String,
  phoneNumber: String,
  email: String,
  imagePath: String,
  registerDate: {
    type: Date,
    default: Date.now,
  },
  joinedEvents: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
  agreementChecked: {type: Boolean, default: false},
  /* permission: [PermissionSchema], */
});

export default mongoose.model('User', userSchema);
