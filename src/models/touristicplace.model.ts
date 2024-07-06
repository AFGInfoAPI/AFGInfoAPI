import { HttpException } from '@/exceptions/HttpException';
import { TouristicPlace } from '@/interfaces/touristicplace.interface';
import { Document, Schema, model } from 'mongoose';

// Define the schema
const touristicPlaceSchema = new Schema(
  {
    en_name: { type: String, required: true, unique: true },
    dr_name: { type: String, required: true, unique: true },
    ps_name: { type: String, required: true, unique: true },
    en_description: { type: String, required: true },
    dr_description: { type: String, required: true },
    ps_description: { type: String, required: true },
    isNationalPark: { type: Boolean, default: false },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    googleMapUrl: { type: String, required: true },
    province_id: { type: Schema.Types.ObjectId, ref: 'Province', required: true },
    images: { type: [String], required: true },
    status: { type: Boolean, default: false },
    hasPending: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Indexes for getting nearby touristic places
touristicPlaceSchema.index({ location: '2dsphere' });

// Indexes for searching touristic places
touristicPlaceSchema.index({ en_name: 'text', dr_name: 'text', ps_name: 'text' });

// Pre-save middleware to check unique fields
touristicPlaceSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const existingTouristicPlace = await TouristicPlaceModel.findOne({
        $or: [{ en_name: this.en_name }, { dr_name: this.dr_name }, { ps_name: this.ps_name }],
      });

      if (existingTouristicPlace) {
        return next(
          new HttpException(400, 'Touristic place already exists', {
            en_name: 'Touristic place already exists',
            dr_name: 'Touristic place already exists',
            ps_name: 'Touristic place already exists',
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
export const TouristicPlaceModel = model<TouristicPlace & Document>('TouristicPlace', touristicPlaceSchema);
