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
    required: true,
    enum: ['auth', 'admin', 'creator'],
    default: 'creator',
    validate: {
      validator: function (v) {
        return /auth|admin|creator/.test(v);
      },
      message: props => `${props.value} is not a valid role!`,
    },
  },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
