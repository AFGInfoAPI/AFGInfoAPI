import { TouristicPlacePndModel } from '@/models/touristicplace.pend.model';
import BaseService from './base.service';
import { TouristicPlacePnd } from '@/interfaces/touristicplace.interface';

class TouristicPlacePndService extends BaseService<TouristicPlacePnd> {
  public touristicPlaces = TouristicPlacePndModel;
  constructor() {
    super(TouristicPlacePndModel);
  }

  // Add the findOne method
  public async findOne(queryObject, projectObj): Promise<TouristicPlacePnd | null> {
    try {
      const result = await this.touristicPlaces.findOne(queryObject, projectObj).exec();
      return result;
    } catch (error) {
      // Log the error or handle it as needed
      console.error('Error finding document:', error);
      throw error;
    }
  }
}

export default TouristicPlacePndService;
