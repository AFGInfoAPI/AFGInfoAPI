import Province from '@/interfaces/province.interface';
import { ProvinceModel } from '@/models/province.model';
import { Meta } from '@/types/meta';
import APIFeatures from '@/utils/helpers/APIFeatures';

class ProvinceService {
  public provinces = ProvinceModel;

  public async findAllProvinces(page: number, limit: number, name: string): Promise<{ provincesData: Province[]; meta: Meta }> {
    const features = new APIFeatures(this.provinces.find().lean(), { page, limit, name }).filter().sort().limitFields().paginate();
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
    const deleteProvince = await this.provinces.findByIdAndDelete(provinceId);
    return deleteProvince;
  }
}

export default ProvinceService;
