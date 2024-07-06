import { HttpException } from '@/exceptions/HttpException';
import { AirportPnd } from '@/interfaces/airport.interface';
import { Document, Schema, model } from 'mongoose';

const airportSchema = new Schema(
  {
    en_name: { type: String, required: true },
    dr_name: { type: String, required: true },
    ps_name: { type: String, required: true },
    en_city: { type: String, required: true },
    dr_city: { type: String, required: true },
    ps_city: { type: String, required: true },
    IATA_Code: { type: String, required: true },
    googleMapUrl: { type: String, required: true },
    numbers_of_terminals: { type: Number, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    airport_id: {
      type: Schema.Types.ObjectId,
      ref: 'Airport',
      required: true,
      unique: true,
    },
    images: { type: [String], required: true },
  },
  { timestamps: true },
);

// Indexes for getting nearby airports
airportSchema.index({ location: '2dsphere' });

// Indexes for searching airports
airportSchema.index({ en_name: 'text', dr_name: 'text', ps_name: 'text', en_city: 'text', dr_city: 'text', ps_city: 'text' });

// Pre-save middleware to check unique fields
airportSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const existingWithAirportId = await AirportPndModel.findOne({ airport_id: this.airport_id });
      if (existingWithAirportId) {
        return next(new HttpException(400, 'Airport already has a pending version', { airport_id: 'Airport already has a pending version' }));
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const AirportPndModel = model<AirportPnd & Document>('AirportPnd', airportSchema);
