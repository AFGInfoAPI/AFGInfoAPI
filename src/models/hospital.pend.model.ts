import { HttpException } from '@/exceptions/HttpException';
import { HospitalPnd } from '@/interfaces/hospital.interface';
import { Document, Schema, model } from 'mongoose';

const hospitalPndSchema = new Schema(
  {
    en_name: { type: String, required: true },
    dr_name: { type: String, required: true },
    ps_name: { type: String, required: true },
    en_address: { type: String, required: true },
    dr_address: { type: String, required: true },
    ps_address: { type: String, required: true },
    phone: { type: String, required: true },
    ambulancePhone: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String, required: false },
    numberOfBeds: { type: Number, required: false },
    images: { type: [String], required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    googleMapUrl: { type: String, required: true },
    hospital_id: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

// Indexes for getting nearby hospitals
hospitalPndSchema.index({ location: '2dsphere' });

// Indexes for searching hospitals
hospitalPndSchema.index({ en_name: 'text', dr_name: 'text', ps_name: 'text' });

// Pre-save middleware to check unique fields
hospitalPndSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const existingWithHospitalId = await HospitalPndModel.findOne({ hospital_id: this.hospital_id });
      if (existingWithHospitalId) {
        return next(new HttpException(400, 'Hospital already has a pending version', { hospital_id: 'Hospital already has a pending version' }));
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const HospitalPndModel = model<HospitalPnd & Document>('HospitalPnd', hospitalPndSchema);
