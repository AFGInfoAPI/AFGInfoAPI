import { HttpException } from '@/exceptions/HttpException';
import { Airport } from '@/interfaces/airport.interface';
import { Document, Schema, model } from 'mongoose';

const airportSchema = new Schema(
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
    en_city: {
      type: String,
      required: true,
    },
    dr_city: {
      type: String,
      required: true,
    },
    ps_city: {
      type: String,
      required: true,
    },
    iata_code: {
      type: String,
      required: true,
    },
    googleMapUrl: {
      type: String,
      required: true,
    },
    number_of_terminals: {
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
    status: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      required: true,
    },
    hasPending: {
      type: Boolean,
      default: false,
    },
    province_id: {
      type: Schema.Types.ObjectId,
      ref: 'Province',
      required: true,
    },
  },
  { timestamps: true },
);

// Indexes for getting nearby provinces
airportSchema.index({ location: '2dsphere' });

//Index for searching by name and city
airportSchema.index({ en_name: 'text', dr_name: 'text', ps_name: 'text', en_city: 'text', dr_city: 'text', ps_city: 'text' });

//pre save middleware to check unique fields by name
airportSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const existingAirport = await AirportModel.findOne({
        $or: [{ en_name: this.en_name }, { dr_name: this.dr_name }, { ps_name: this.ps_name }],
      });
      if (existingAirport) {
        return next(
          new HttpException(400, 'Airport with this name already exists', {
            en_name: 'Airport with this name already exists',
            dr_name: 'Airport with this name already exists',
            ps_name: 'Airport with this name already exists',
          }),
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const AirportModel = model<Airport & Document>('Airport', airportSchema);
