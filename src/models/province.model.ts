import Province from '@/interfaces/province.interface';
import { Document, Schema, model } from 'mongoose';

const provinceSchema = new Schema({
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
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
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
  images: {
    type: [String],
    required: true,
  },
});

export const ProvinceModel = model<Province & Document>('Province', provinceSchema);
