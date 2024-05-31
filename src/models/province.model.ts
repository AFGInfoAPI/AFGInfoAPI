import Province from '@/interfaces/province.interface';
import { Document, Schema, model } from 'mongoose';

const provinceSchema = new Schema(
  {
    name: {
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
      required: true,
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
    capital: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    governor: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    last: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Indexes for getting nearby provinces
provinceSchema.index({ location: '2dsphere' });

// Indexes for searching provinces
provinceSchema.index({ name: 'text', capital: 'text' });

export const ProvinceModel = model<Province & Document>('Province', provinceSchema);
