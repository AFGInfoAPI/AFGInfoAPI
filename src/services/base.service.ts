import mongoose, { Model, Document, UpdateQuery } from 'mongoose';
import APIFeatures from '@/utils/helpers/APIFeatures';

class BaseService<T extends Document> {
  public model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async findAll(page: number, limit: number, search: string, searchFields = [], projectObj = {}): Promise<{ data: T[]; meta: any }> {
    const query = this.model.find().lean();

    const features = new APIFeatures(query, { page, limit, search }, searchFields).filter().sort().limitFields().paginate().projectFields(projectObj); // Add projection fields

    const pipeline = features.getPipeline();

    const data = await this.model.aggregate(pipeline).exec();
    const meta = await features.getMeta();
    return { meta, data };
  }

  public async findById(id: string, projectObj: { [key: string]: string | number | undefined }): Promise<{ name: string } | null> {
    const data = await this.model
      .aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } }, // Match the document by _id
        { $project: projectObj }, // Project en_name as name and exclude _id
      ])
      .exec();

    if (data && data.length > 0) {
      return data[0]; // Return the first (and only) document in the result
    }

    return null; // Return null if no document is found
  }

  public async create(data: T): Promise<T> {
    const newData = await this.model.create(data);
    return newData;
  }

  public async update(id: string, data: UpdateQuery<T>): Promise<T> {
    const updatedData = await this.model.findByIdAndUpdate(id, data, { new: true });
    return updatedData;
  }

  public async delete(id: string): Promise<T> {
    const deletedData = await this.model.findByIdAndDelete(id);
    return deletedData;
  }
}

export default BaseService;
