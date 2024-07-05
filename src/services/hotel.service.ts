import { HotelModel } from '@/models/hotel.model';
import { Hotel } from '@/interfaces/hotel.interface';
import GeoService from './nearest.service';
import BaseService from './base.service';

class HotelService extends BaseService<Hotel> {
  public hotels = HotelModel;
  constructor() {
    super(HotelModel);
  }

  async getNearbyHotels(lat: number, long: number) {
    const geoService = new GeoService(this.hotels);
    const hotels = await geoService.findNearby(lat, long, null, [
      {
        $limit: 10,
      },
      {
        $match: { status: true },
      },
    ]);
    return hotels;
  }
}

export default HotelService;
