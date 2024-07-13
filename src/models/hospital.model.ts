import { HttpException } from '@/exceptions/HttpException';
import { Hospital } from '@/interfaces/hospital.interface';
import { Document, Schema, model } from 'mongoose';

const hospitalSchema = new Schema(
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
    province_id: {
      type: Schema.Types.ObjectId,
      ref: 'Province',
      required: true,
    },
    hasPending: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Indexes for getting nearby hospitals
hospitalSchema.index({ location: '2dsphere' });

// Indexes for searching hospitals
hospitalSchema.index({ en_name: 'text', dr_name: 'text', ps_name: 'text' });

// Pre-save middleware to check unique fields
hospitalSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const existingHospital = await HospitalModel.findOne({
        $or: [{ en_name: this.en_name, dr_name: this.dr_name, ps_name: this.ps_name }],
      });
      if (existingHospital) {
        return next(
          new HttpException(400, 'Hospital already exists in this province', {
            en_name: 'Hospital already exists in this province',
            dr_name: 'Hospital already exists in this province',
            ps_name: 'Hospital already exists in this province',
          }),
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const HospitalModel = model<Hospital & Document>('Hospital', hospitalSchema);
