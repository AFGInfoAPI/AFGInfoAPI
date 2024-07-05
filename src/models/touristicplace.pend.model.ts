import { HttpException } from '@/exceptions/HttpException';
import { TouristicPlacePnd } from '@/interfaces/touristicplace.interface';
import { Document, Schema, model } from 'mongoose';

const touristicPlacePndSchema = new Schema(
  {
    en_name: { type: String, required: true },
    dr_name: { type: String, required: true },
    ps_name: { type: String, required: true },
    en_description: { type: String, required: true },
    dr_description: { type: String, required: true },
    ps_description: { type: String, required: true },
    isNationalPark: { type: Boolean, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    googleMapUrl: { type: String, required: true },
    images: { type: [String], required: true },
    status: { type: Boolean, default: false },
    touristic_place_id: {
      type: Schema.Types.ObjectId,
      ref: 'TouristicPlace',
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

// Indexes for getting nearby touristic places
touristicPlacePndSchema.index({ location: '2dsphere' });

// Indexes for searching touristic places
touristicPlacePndSchema.index({ en_name: 'text', dr_name: 'text', ps_name: 'text' });

// Pre-save middleware to check unique fields
touristicPlacePndSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const existingWithTouristicPlaceId = await TouristicPlacePndModel.findOne({ touristic_place_id: this.touristic_place_id });
      if (existingWithTouristicPlaceId) {
        return next(
          new HttpException(400, 'Touristic place already has a pending version', {
            touristic_place_id: 'Touristic place already has a pending version',
          }),
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const TouristicPlacePndModel = model<TouristicPlacePnd & Document>('TouristicPlacePnd', touristicPlacePndSchema);
