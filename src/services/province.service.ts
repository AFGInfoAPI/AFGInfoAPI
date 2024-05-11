import Province from '@/interfaces/province.interface';
import { ProvinceModel } from '@/models/province.model';

class ProvinceService {
  public provinces = ProvinceModel;

  public async findAllProvinces(page: number, limit: number): Promise<{ provinces: Province[]; total: number }> {
    const skip = (page - 1) * limit;
    const total = await this.provinces.countDocuments();
    const provinces = await this.provinces.find().skip(skip).limit(limit).lean();
    return { provinces, total };
  }

  public async findProvinceById(provinceId: string) {
    const province = await this.provinces.findOne({ _id: provinceId }).lean();
    return province;
  }

  public async createProvince(provinceData) {
    const createProvince = await this.provinces.create(provinceData);
    return createProvince;
  }

  public async updateProvince(provinceId: string, provinceData) {
    const updateProvince = await this.provinces.findByIdAndUpdate(provinceId, provinceData);
    return updateProvince;
  }

  public async deleteProvince(provinceId: string) {
    const deleteProvince = await this.provinces.findByIdAndDelete(provinceId);
    return deleteProvince;
  }
}

export default ProvinceService;
