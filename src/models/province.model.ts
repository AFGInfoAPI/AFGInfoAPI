import { Province } from '@/interfaces/province.interface';
import { Document, Schema, model } from 'mongoose';

const provinceSchema = new Schema(
  {
    en_name: {
      type: String,
      required: true,
      unique: true,
    },
    dr_name: {
      type: String,
      required: true,
      unique: true,
    },
    ps_name: {
      type: String,
      required: true,
      unique: true,
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
    en_capital: {
      type: String,
      required: true,
    },
    dr_capital: {
      type: String,
      required: true,
    },
    ps_capital: {
      type: String,
      required: true,
    },
    en_description: {
      type: String,
      required: true,
    },
    dr_description: {
      type: String,
      required: true,
    },
    ps_description: {
      type: String,
      required: true,
    },
    en_governor: {
      type: String,
      required: true,
    },
    dr_governor: {
      type: String,
      required: true,
    },
    ps_governor: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    hasPending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Indexes for getting nearby provinces
provinceSchema.index({ location: '2dsphere' });

// Indexes for searching provinces
provinceSchema.index({ name: 'text', capital: 'text' });

export const ProvinceModel = model<Province & Document>('Province', provinceSchema);
