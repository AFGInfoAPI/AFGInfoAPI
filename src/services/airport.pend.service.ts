import { AirportPndModel } from '@/models/airport.pend.model';
import BaseService from './base.service';
import { AirportPnd } from '@/interfaces/airport.interface';

class AirportPndService extends BaseService<AirportPnd> {
  public airports = AirportPndModel;
  constructor() {
    super(AirportPndModel);
  }

  // Add the findOne method
  public async findOne(queryObject, projectObj): Promise<AirportPnd | null> {
    try {
      const result = await this.airports.findOne(queryObject, projectObj).lean();
      return result as AirportPnd;
    } catch (error) {
      // Log the error or handle it as needed
      console.error('Error finding document:', error);
      throw error;
    }
  }
}

export default AirportPndService;
