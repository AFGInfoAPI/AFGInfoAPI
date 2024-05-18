import { Model } from 'mongoose';

class GeoService {
  private model: Model<any>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  public async findNearby(latitude: number, longitude: number, maxDistance?: number): Promise<any[]> {
    const results = await this.model.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'distance',
          maxDistance: maxDistance || 10000000000000,
          spherical: true,
        },
      },
    ]);

    return results;
  }
}

export default GeoService;
