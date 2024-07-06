import { HttpException } from '@/exceptions/HttpException';
import { ProvincePnd } from '@/interfaces/province.interface';
import { Document, Schema, model } from 'mongoose';

const provinceSchema = new Schema(
  {
    en_name: { type: String, required: true },
    dr_name: { type: String, required: true },
    ps_name: { type: String, required: true },
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
    images: { type: [String], required: true },
    province_id: {
      type: Schema.Types.ObjectId,
      ref: 'Province',
      required: true,
      unique: true,
    },
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
      const existingWithProvinceId = await ProvincePndModel.findOne({ province_id: this.province_id });
      if (existingWithProvinceId) {
        return next(new HttpException(400, 'Province already has a pending version', { province_id: 'Province already has a pending version' }));
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const ProvincePndModel = model<ProvincePnd & Document>('ProvincePnd', provinceSchema);
