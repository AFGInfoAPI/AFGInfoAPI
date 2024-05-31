import District from '@/interfaces/distict.interface';
import { Document, Schema, model } from 'mongoose';

const districtSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    capital: {
      type: String,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    population: {
      type: Number,
      required: true,
    },
    gdp: {
      type: Number,
      required: false,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    googleMapUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    governor: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      required: true,
    },
    provinceId: {
      type: Schema.Types.ObjectId,
      ref: 'Province',
      required: true,
    },
    last: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
); // Add timestamps to the schema

// Indexes for getting nearby provinces
districtSchema.index({ location: '2dsphere' });

// Indexes for searching provinces
districtSchema.index({ name: 'text', capital: 'text' });

export const DistrictModle = model<District & Document>('District', districtSchema);
