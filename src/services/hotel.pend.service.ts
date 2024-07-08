import { HotelPndModel } from '@/models/hotel.pend.model';
import BaseService from './base.service';
import { HotelPnd } from '@/interfaces/hotel.interface';

class HotelPndService extends BaseService<HotelPnd> {
  public hotels = HotelPndModel;

  constructor() {
    super(HotelPndModel);
  }

  // Add the findOne method
  public async findOne(queryObject, projectObj): Promise<HotelPnd | null> {
    try {
      const result = await this.hotels.findOne(queryObject, projectObj).exec();
      return result;
    } catch (error) {
      // Log the error or handle it as needed
      console.error('Error finding document:', error);
      throw error;
    }
  }
}

export default HotelPndService;
