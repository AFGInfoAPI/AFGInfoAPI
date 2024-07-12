import { HotelPndModel } from '@/models/hotel.pend.model';
import BaseService from './base.service';
import { HotelPnd } from '@/interfaces/hotel.interface';

class HotelPndService extends BaseService<HotelPnd> {
  public hotels = HotelPndModel;

  constructor() {
    super(HotelPndModel);
  }
}

export default HotelPndService;
