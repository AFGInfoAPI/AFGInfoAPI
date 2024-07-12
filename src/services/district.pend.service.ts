import { DistrictPndModel } from '@/models/district.pend.model';
import BaseService from './base.service';
import { DistrictPnd } from '@/interfaces/district.interface';

class DistrictPndService extends BaseService<DistrictPnd> {
  public districts = DistrictPndModel;

  constructor() {
    super(DistrictPndModel);
  }

  // Add the findOne method
  public async findOne(queryObject, projectObj): Promise<DistrictPnd | null> {
    try {
      const result = await this.districts.findOne(queryObject, projectObj).lean();
      return result as DistrictPnd;
    } catch (error) {
      // Log the error or handle it as needed
      console.error('Error finding document:', error);
      throw error;
    }
  }
}

export default DistrictPndService;
