import { HttpException } from '@/exceptions/HttpException';
import { ParkPnd } from '@/interfaces/park.interface';
import { Document, Schema, model } from 'mongoose';

// Define the schema
const parkSchema = new Schema(
  {
    en_name: { type: String, required: true, unique: true },
    dr_name: { type: String, required: true, unique: true },
    ps_name: { type: String, required: true, unique: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    googleMapUrl: { type: String, required: true },
    images: { type: [String], required: true },
    hasPending: { type: Boolean, default: false },
    park_id: {
      type: Schema.Types.ObjectId,
      ref: 'Park',
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

// Indexes for getting nearby parks
parkSchema.index({ location: '2dsphere' });

// Indexes for searching parks
parkSchema.index({ en_name: 'text', dr_name: 'text', ps_name: 'text' });

// Pre-save middleware to check unique fields
parkSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const existingWithParkId = await ParkPndModel.findOne({ park_id: this.park_id });

      if (existingWithParkId) {
        return next(new HttpException(400, 'Park already has a pending version', { park_id: 'Park already has a pending version' }));
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const ParkPndModel = model<ParkPnd & Document>('ParkPnd', parkSchema);
