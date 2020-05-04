import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PermissionSchema = new Schema({
  level: Number,
  name: String,
});

export default PermissionSchema;
