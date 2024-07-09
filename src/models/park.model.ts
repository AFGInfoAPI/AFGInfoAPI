import { HttpException } from '../exceptions/HttpException';
import { Park } from '../interfaces/park.interface';
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
    status: { type: Boolean, default: false },
    images: { type: [String], required: true },
    hasPending: { type: Boolean, default: false },
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
      const existingPark = await ParkModel.findOne({
        $or: [{ en_name: this.en_name }, { dr_name: this.dr_name }, { ps_name: this.ps_name }],
      });

      if (existingPark) {
        return next(
          new HttpException(400, 'Park already exists', {
            en_name: 'Park already exists',
            dr_name: 'Park already exists',
            ps_name: 'Park already exists',
          }),
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Create the model
export const ParkModel = model<Park & Document>('Park', parkSchema);
