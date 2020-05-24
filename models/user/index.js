import mongoose from 'mongoose';
import PermissionSchema from './permission';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
  agreementChecked: {type: Boolean, default: false},
  permission: [PermissionSchema],
});

export default mongoose.model('user', UserSchema);
