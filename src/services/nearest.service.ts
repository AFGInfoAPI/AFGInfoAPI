import { Model } from 'mongoose';

class GeoService {
  private model: Model<any>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  public async findNearby(latitude: number, longitude: number, maxDistance?: number): Promise<any[]> {
    const results = await this.model
      .find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxDistance || 10000000000000,
          },
        },
      })
      .lean();

    return results;
  }
}

export default GeoService;
