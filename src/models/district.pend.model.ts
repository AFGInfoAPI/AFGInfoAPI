import { HttpException } from '@/exceptions/HttpException';
import { DistrictPnd } from '@/interfaces/district.interface';
import { Document, Schema, model } from 'mongoose';

const districtSchema = new Schema(
  {
    en_name: { type: String, required: true },
    dr_name: { type: String, required: true },
    ps_name: { type: String, required: true },
    en_capital: { type: String, required: true },
    dr_capital: { type: String, required: true },
    ps_capital: { type: String, required: true },
    area: { type: Number, required: true },
    population: { type: Number, required: true },
    gdp: { type: Number, required: false },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    googleMapUrl: { type: String, required: true },
    en_description: { type: String, required: true },
    dr_description: { type: String, required: true },
    ps_description: { type: String, required: true },
    en_governor: { type: String, required: true },
    dr_governor: { type: String, required: true },
    ps_governor: { type: String, required: true },
    images: { type: [String], required: true },
    status: { type: Boolean, default: false },
    district_id: {
      type: Schema.Types.ObjectId,
      ref: 'District',
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

// Indexes for getting nearby districts
districtSchema.index({ location: '2dsphere' });

// Indexes for searching districts
districtSchema.index({ name: 'text', capital: 'text' });

// Pre-save middleware to check unique fields
districtSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const existingWithDistrictId = await DistrictPndModel.findOne({ district_id: this.district_id });
      if (existingWithDistrictId) {
        return next(new HttpException(400, 'District already has a pending version', { district_id: 'District already has a pending version' }));
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const DistrictPndModel = model<DistrictPnd & Document>('DistrictPnd', districtSchema);
