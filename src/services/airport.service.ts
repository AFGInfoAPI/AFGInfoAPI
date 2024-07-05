import { Airport } from '@/interfaces/airport.interface';
import { AirportModel } from '@/models/airport.model';
import BaseService from './base.service';
import GeoService from './nearest.service';

class AirportService extends BaseService<Airport> {
  public airports = AirportModel;

  constructor() {
    super(AirportModel);
  }

  public async getNearbyAirports(lat: number, lng: number) {
    const geoService = new GeoService(this.airports);
    const airports = await geoService.findNearby(lat, lng, null, [
      {
        $limit: 10,
      },
      {
        $match: { status: true },
      },
    ]);
    return airports;
  }
}

export default AirportService;
