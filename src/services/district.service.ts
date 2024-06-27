import { District } from '@/interfaces/district.interface';
import { DistrictModle } from '@/models/district.model';
import GeoService from './nearest.service';
import BaseService from './base.service';

class DistrictService extends BaseService<District> {
  public districts = DistrictModle;
  constructor() {
    super(DistrictModle);
  }

  async getNearbyDistrict(lat: number, long: number) {
    const geoService = new GeoService(this.districts);
    const districts = await geoService.findNearby(lat, long, null, [
      {
        $limit: 10,
      },
      {
        $match: { status: true },
      },
    ]);
    return districts;
  }
}
export default DistrictService;
