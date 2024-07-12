import { HospitalModel } from '@/models/hospital.model';
import BaseService from './base.service';
import { Hospital } from '@/interfaces/hospital.interface';
import GeoService from './nearest.service';

class HospitalService extends BaseService<Hospital> {
  public hospitals = HospitalModel;
  constructor() {
    super(HospitalModel);
  }

  async getNearbyHospitals(lat: number, long: number) {
    const geoService = new GeoService(this.hospitals);
    const hospitals = await geoService.findNearby(lat, long, null, [
      {
        $limit: 10,
      },
      {
        $match: { status: true },
      },
    ]);
    return hospitals;
  }
}

export default HospitalService;
