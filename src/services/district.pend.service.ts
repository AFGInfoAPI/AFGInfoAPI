import { DistrictPndModel } from '@/models/district.pend.model';
import BaseService from './base.service';
import { DistrictPnd } from '@/interfaces/district.interface';

class DistrictPndService extends BaseService<DistrictPnd> {
  public districts = DistrictPndModel;

  constructor() {
    super(DistrictPndModel);
  }

  // Add the findOne method
  public async findOne(query: object): Promise<DistrictPnd | null> {
    try {
      const result = await this.districts.findOne(query).exec();
      return result;
    } catch (error) {
      // Log the error or handle it as needed
      console.error('Error finding document:', error);
      throw error;
    }
  }
}

export default DistrictPndService;
