import { Model } from 'mongoose';

class GeoService {
  private model: Model<any>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  public async findNearby(latitude: number, longitude: number, maxDistance?: number, queryArr?: any[]): Promise<any[]> {
    const results = await this.model.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'distance',
          maxDistance: maxDistance || 10000000000000,
          spherical: true,
        },
        // Limit
        // $limit: 10,
        // Select provinces that it's status is true
        // $match: { status: true },
      },
      ...queryArr,
    ]);

    return results;
  }
}

export default GeoService;
