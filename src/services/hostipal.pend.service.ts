import { HospitalPndModel } from '@/models/hospital.pend.model';
import BaseService from './base.service';
import { HospitalPnd } from '@/interfaces/hospital.interface';

class HospitalPndService extends BaseService<HospitalPnd> {
  public hospitals = HospitalPndModel;

  constructor() {
    super(HospitalPndModel);
  }

  // Add the findOne method
  public async findOne(queryObject, projectObj): Promise<HospitalPnd | null> {
    try {
      const result = await this.hospitals.findOne(queryObject, projectObj).lean();
      return result as HospitalPnd;
    } catch (error) {
      // Log the error or handle it as needed
      console.error('Error finding document:', error);
      throw error;
    }
  }
}

export default HospitalPndService;
