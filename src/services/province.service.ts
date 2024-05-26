import Province from '@/interfaces/province.interface';
import { ProvinceModel } from '@/models/province.model';
import { Meta } from '@/types/meta';
import APIFeatures from '@/utils/helpers/APIFeatures';
import fs from 'fs';
import GeoService from './nearest.service';

class ProvinceService {
  public provinces = ProvinceModel;

  public async findAllProvinces(page: number, limit: number, search: string): Promise<{ provincesData: Province[]; meta: Meta }> {
    let query;

    if (search) {
      const regex = new RegExp(search, 'i'); // 'i' makes it case insensitive
      query = this.provinces
        .find({
          $or: [{ name: regex }, { capital: regex }],
        })
        .lean();
    } else {
      query = this.provinces.find().lean();
    }

    const features = new APIFeatures(query, { page, limit }).filter().sort().limitFields().paginate();

    const provincesData = await features.query;
    const meta = await features.getMeta();
    return { meta, provincesData };
  }

  public async findProvinceById(provinceId: string) {
    const province = await this.provinces.findOne({ _id: provinceId }).lean();
    return province;
  }

  public async createProvince(provinceData: Province) {
    const createProvince = await this.provinces.create(provinceData);
    return createProvince;
  }

  public async updateProvince(provinceId: string, provinceData: Province) {
    const updateProvince = await this.provinces.findByIdAndUpdate(provinceId, provinceData, { new: true });
    return updateProvince;
  }

  public async deleteProvince(provinceId: string) {
    const provinceImages = await this.provinces.findById(provinceId).select('images');
    const deleteProvince = await this.provinces.findByIdAndDelete(provinceId);
    if (deleteProvince) {
      // Delete images from the server
      provinceImages.images.forEach((image: string) => {
        fs.unlink(`uploads/${image}`, err => {
          if (err) {
            console.error(err);
          }
        });
      });
    }
    return deleteProvince;
  }

  async getNearbyProvinces(lat: number, lng: number) {
    const geoService = new GeoService(this.provinces);
    const provinces = await geoService.findNearby(lat, lng);
    return provinces;
  }
}

export default ProvinceService;
