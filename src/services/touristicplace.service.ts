import { TouristicPlace } from '@/interfaces/touristicplace.interface';
import { TouristicPlaceModel } from '@/models/touristicplace.model';
import BaseService from './base.service';
import GeoService from './nearest.service';

class TouristicPlaceService extends BaseService<TouristicPlace> {
  public touristicPlaces = TouristicPlaceModel;
  constructor() {
    super(TouristicPlaceModel);
  }

  async getNearbyTouristicPlaces(lat: number, lng: number) {
    const geoService = new GeoService(this.touristicPlaces);
    const touristicPlaces = await geoService.findNearby(lat, lng, null, [
      {
        $limit: 10,
      },
      {
        $match: { status: true },
      },
    ]);
    return touristicPlaces;
  }
}
export default TouristicPlaceService;
