import { HttpException } from '@/exceptions/HttpException';
import { HotelPnd } from '@/interfaces/hotel.interface';
import { Document, Schema, model } from 'mongoose';

const hotelPndSchema = new Schema(
  {
    en_name: { type: String, required: true },
    dr_name: { type: String, required: true },
    ps_name: { type: String, required: true },
    en_description: { type: String, required: true },
    dr_description: { type: String, required: true },
    ps_description: { type: String, required: true },
    en_address: { type: String, required: true },
    dr_address: { type: String, required: true },
    ps_address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String, required: false },
    rating: { type: Number, required: false },
    star: { type: Number, required: false },
    images: { type: [String], required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    googleMapUrl: { type: String, required: true },
    hotel_id: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

// Indexes for getting nearby hotels
hotelPndSchema.index({ location: '2dsphere' });

// Indexes for searching hotels
hotelPndSchema.index({ name: 'text', address: 'text' });

// Pre-save middleware to check unique fields
hotelPndSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const existingWithHotelId = await HotelPndModel.findOne({ hotel_id: this.hotel_id });
      if (existingWithHotelId) {
        return next(new HttpException(400, 'Hotel already has a pending version', { hotel_id: 'Hotel already has a pending version' }));
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const HotelPndModel = model<HotelPnd & Document>('HotelPnd', hotelPndSchema);
