import District from '@/interfaces/distict.interface';
import APIFeatures from '@/utils/helpers/APIFeatures';
import { DistrictModle } from 'models/district.model';
import { Meta } from '@/types/meta';
import GeoService from './nearest.service';
import fs from 'fs';

class DistrictService {
  public districts = DistrictModle;
  async findAllDistricts(page: number, limit: number, search: string): Promise<{ districtsData: District[]; meta: Meta }> {
    const query = this.districts.find().lean();
    const features = new APIFeatures(query, { page, limit, search }, ['name', 'capital']).filter().sort().limitFields().paginate();
    const districtsData = await features.query;
    const meta = await features.getMeta();
    return { meta, districtsData };
  }

  async findDistrictById(districtId: string) {
    const district = await this.districts.findOne({ _id: districtId }).lean();
    return district;
  }

  async createDistrict(districtData: District) {
    const createDistrict = await this.districts.create(districtData);
    return createDistrict;
  }

  async updateDistrict(districtId: string, districtData: District) {
    const updateDistrict = await this.districts.findByIdAndUpdate(districtId, districtData, { new: true });
    return updateDistrict;
  }

  async deleteDistrict(districtId: string) {
    const districtImages = await this.districts.findById(districtId).select('images');
    const deleteDistrict = await this.districts.findByIdAndDelete(districtId);
    if (deleteDistrict) {
      // Delete images from the server
      districtImages.images.forEach((image: string) => {
        fs.unlink(`uploads/${image}`, err => {
          if (err) {
            console.error(err);
          }
        });
      });
    }
    return deleteDistrict;
  }

  async getNearestDistricts(lat: number, long: number) {
    const geoService = new GeoService(this.districts);
    const nearestDistricts = await geoService.findNearby(lat, long);
    return nearestDistricts;
  }
}
export default DistrictService;
