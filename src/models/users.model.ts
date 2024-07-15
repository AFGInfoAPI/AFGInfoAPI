import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['auth', 'admin', 'creator'],
    default: 'admin',
  },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
