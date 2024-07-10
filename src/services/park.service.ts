import { Park } from '@/interfaces/park.interface';
import { ParkModel } from '@/models/park.model';
import GeoService from './nearest.service';
import BaseService from './base.service';

class ParkService extends BaseService<Park> {
  public parks = ParkModel;
  constructor() {
    super(ParkModel);
  }

  async getNearbyParks(lat: number, lng: number) {
    const geoService = new GeoService(this.parks);
    const parks = await geoService.findNearby(lat, lng, null, [
      {
        $limit: 10,
      },
      {
        $match: { status: true },
      },
    ]);
    return parks;
  }
}

export default ParkService;
