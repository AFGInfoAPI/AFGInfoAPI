import { AirportPndModel } from '@/models/airport.pend.model';
import BaseService from './base.service';
import { AirportPnd } from '@/interfaces/airport.interface';

class AirportPndService extends BaseService<AirportPnd> {
  public airports = AirportPndModel;
  constructor() {
    super(AirportPndModel);
  }

  // Add the findOne method
  public async findOne(query: object): Promise<AirportPnd | null> {
    try {
      const result = await this.airports.findOne(query).exec();
      return result;
    } catch (error) {
      // Log the error or handle it as needed
      console.error('Error finding document:', error);
      throw error;
    }
  }
}

export default AirportPndService;
