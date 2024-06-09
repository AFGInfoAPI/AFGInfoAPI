import { HttpException } from '@/exceptions/HttpException';
import { Province } from '@/interfaces/province.interface';
import { Document, Schema, model } from 'mongoose';

// Define the schema
const provinceSchema = new Schema(
  {
    en_name: { type: String, required: true, unique: true },
    dr_name: { type: String, required: true, unique: true },
    ps_name: { type: String, required: true, unique: true },
    area: { type: Number, required: true },
    population: { type: Number, required: true },
    gdp: { type: Number, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    googleMapUrl: { type: String, required: true },
    en_capital: { type: String, required: true },
    dr_capital: { type: String, required: true },
    ps_capital: { type: String, required: true },
    en_description: { type: String, required: true },
    dr_description: { type: String, required: true },
    ps_description: { type: String, required: true },
    en_governor: { type: String, required: true },
    dr_governor: { type: String, required: true },
    ps_governor: { type: String, required: true },
    images: { type: [String], required: true },
    status: { type: Boolean, default: true },
    hasPending: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Indexes for getting nearby provinces
provinceSchema.index({ location: '2dsphere' });

// Indexes for searching provinces
provinceSchema.index({ en_name: 'text', dr_name: 'text', ps_name: 'text', en_capital: 'text', dr_capital: 'text', ps_capital: 'text' });

// Pre-save middleware to check unique fields
provinceSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const existingProvince = await ProvinceModel.findOne({
        $or: [{ en_name: this.en_name }, { dr_name: this.dr_name }, { ps_name: this.ps_name }],
      });

      if (existingProvince) {
        return next(
          new HttpException(400, 'Province already exists', {
            en_name: 'Province already exists',
            dr_name: 'Province already exists',
            ps_name: 'Province already exists',
          }),
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Create and export the model
export const ProvinceModel = model<Province & Document>('Province', provinceSchema);
