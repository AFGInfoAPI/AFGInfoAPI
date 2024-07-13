import { HttpException } from '@/exceptions/HttpException';
import { Hotel } from '@/interfaces/hotel.interface';
import { Document, Schema, model } from 'mongoose';

const hotelSchema = new Schema(
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
    en_address: {
      type: String,
      required: true,
    },
    dr_address: {
      type: String,
      required: true,
    },
    ps_address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      required: false,
      min: 0,
      max: 5,
    },
    images: {
      type: [String],
      required: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
    province_id: {
      type: Schema.Types.ObjectId,
      ref: 'Province',
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
      required: false,
    },
    hasPending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

//Indexing for search near by hotels
hotelSchema.index({ location: '2dsphere' });

//indexing for search by name
hotelSchema.index({ en_name: 'text', dr_name: 'text', ps_name: 'text' });

//per save middleware to check unique fields
hotelSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const existingHotel = await HotelModel.findOne({
        $or: [{ en_name: this.en_name }, { dr_name: this.dr_name }, { ps_name: this.ps_name }],
      });

      if (existingHotel) {
        return next(
          new HttpException(400, 'Hotel already exists', {
            en_name: 'Hotel already exists',
            dr_name: 'Hotel already exists',
            ps_name: 'Hotel already exists',
          }),
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

export const HotelModel = model<Hotel & Document>('Hotel', hotelSchema);
