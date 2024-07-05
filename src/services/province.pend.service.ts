import { ProvincePndModel } from '@/models/province.pend.model';
import BaseService from './base.service';
import { ProvincePnd } from '@/interfaces/province.interface';

class ProvincePndService extends BaseService<ProvincePnd> {
  public provinces = ProvincePndModel;
  constructor() {
    super(ProvincePndModel);
  }

  // Add the findOne method
  public async findOne(queryObject, projectObj): Promise<ProvincePnd | null> {
    try {
      const result = await this.provinces.findOne(queryObject, projectObj).exec();
      return result;
    } catch (error) {
      // Log the error or handle it as needed
      console.error('Error finding document:', error);
      throw error;
    }
  }
}

export default ProvincePndService;
