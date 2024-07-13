import { ParkPndModel } from '@/models/park.pend.model';
import BaseService from './base.service';
import { ParkPnd } from '@/interfaces/park.interface';

class ParkPndService extends BaseService<ParkPnd> {
  public parks = ParkPndModel;
  constructor() {
    super(ParkPndModel);
  }

  // Add the findOne method
  public async findOne(queryObject, projectObj): Promise<ParkPnd | null> {
    try {
      const result = await this.parks.findOne(queryObject, projectObj).lean();
      return result as ParkPnd;
    } catch (error) {
      // Log the error or handle it as needed
      console.error('Error finding document:', error);
      throw error;
    }
  }
}

export default ParkPndService;
