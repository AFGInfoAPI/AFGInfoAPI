import { Model, Document, UpdateQuery } from 'mongoose';
import APIFeatures from '@/utils/helpers/APIFeatures';

class BaseService<T extends Document> {
  public model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async findAll(page: number, limit: number, search: string, searchFields = []): Promise<{ data: T[]; meta: any }> {
    const query = this.model.find().lean();

    const features = new APIFeatures(query, { page, limit, search }, searchFields).filter().sort().limitFields().paginate();

    const data = await features.query;
    const meta = await features.getMeta();
    return { meta, data };
  }

  public async findById(id: string): Promise<T> {
    const data = (await this.model.findOne({ _id: id }).lean()) as T;
    return data;
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
