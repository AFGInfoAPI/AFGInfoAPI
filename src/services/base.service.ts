import mongoose, { Model, Document, UpdateQuery, PipelineStage } from 'mongoose';
import APIFeatures from '@/utils/helpers/APIFeatures';
import { Province } from '@/interfaces/province.interface';
import { HttpException } from '@/exceptions/HttpException';

class BaseService<T extends Document> {
  public model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async findAll(filters = {}, searchFields = [], projectObj = {}): Promise<{ data: T[]; meta: any }> {
    const query = this.model.find().lean();

    const features = new APIFeatures(query, { ...filters }, searchFields).filter().sort().limitFields().paginate().projectFields(projectObj); // Add projection fields

    const pipeline = features.getPipeline();
    console.log('Aggregation Pipeline:', JSON.stringify(pipeline, null, 2));

    const data = await this.model.aggregate(pipeline).exec();
    if (!data) throw new HttpException(404, 'Data not found');
    const meta = await features.getMeta();
    return { meta, data };
  }

  public async findById(id: string, projectObj: { [key: string]: string | number | undefined } = {}): Promise<T | null> {
    const locPipline: PipelineStage[] = [{ $match: { _id: new mongoose.Types.ObjectId(id) } }];
    if (Object.keys(projectObj).length > 0) {
      locPipline.push({ $project: projectObj });
    }
    const data = await this.model.aggregate(locPipline).exec();

    if (data.length < 1) throw new HttpException(404, 'Data not found');

    if (data && data.length > 0) {
      return data[0]; // Return the first (and only) document in the result
    }

    return null; // Return null if no document is found
  }

  public async create(data: T): Promise<T> {
    const newData = await this.model.create(data);

    if (!newData) throw new HttpException(500, 'Data not created');
    return newData;
  }

  public async update(id: string, data: UpdateQuery<T>): Promise<T> {
    const updatedData = await this.model.findByIdAndUpdate(id, data, { new: true });
    if (!updatedData) throw new HttpException(404, 'Data not found');
    return updatedData;
  }

  public async delete(id: string): Promise<T> {
    const deletedData = await this.model.findByIdAndDelete(id);
    if (!deletedData) throw new HttpException(404, 'Data not found');
    return deletedData;
  }

  public async checkDuplicate(arrayObject: any[]) {
    const conditions = arrayObject.map(obj => {
      const condition = {};
      for (const key in obj) {
        condition[key] = obj[key];
      }
      return condition;
    });

    const duplicate = await this.model.findOne({ $or: conditions });

    return duplicate;
  }
}

export default BaseService;
