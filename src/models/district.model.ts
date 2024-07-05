import { HttpException } from '@/exceptions/HttpException';
import { District } from '@/interfaces/district.interface';
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
    province_id: {
      type: Schema.Types.ObjectId,
      ref: 'Province',
      required: true,
    },
    dr_governor: {
      type: String,
      required: true,
    },
    en_governor: {
      type: String,
      required: true,
    },
    ps_governor: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    hasPending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Indexes for getting nearby provinces
districtSchema.index({ location: '2dsphere' });

// Indexes for searching provinces
districtSchema.index({ name: 'text', capital: 'text' });

// Pre-save middleware to check unique fields
districtSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const existingDistrict = await DistrictModle.findOne({
        $or: [{ en_name: this.en_name }, { dr_name: this.dr_name }, { ps_name: this.ps_name }],
      });

      if (existingDistrict) {
        return next(
          new HttpException(400, 'District already exists', {
            en_name: 'District already exists',
            dr_name: 'District already exists',
            ps_name: 'District already exists',
          }),
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const DistrictModle = model<District & Document>('District', districtSchema);
