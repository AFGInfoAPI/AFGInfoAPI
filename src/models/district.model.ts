import District from '@/interfaces/distict.interface';
import { Document, Schema, model } from 'mongoose';

const districtSchema = new Schema(
  {
    en_name: {
      type: String,
      required: true,
    },
    dr_name: {
      type: String,
      required: true,
    },
    ps_name: {
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
