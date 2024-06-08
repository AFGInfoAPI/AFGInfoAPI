import { ProvincePndModel } from '@/models/province.pend.model';
import BaseService from './base.service';
import { ProvincePnd } from '@/interfaces/province.interface';

class ProvincePndService extends BaseService<ProvincePnd> {
  public provinces = ProvincePndModel;
  constructor() {
    super(ProvincePndModel);
  }
}

export default ProvincePndService;
