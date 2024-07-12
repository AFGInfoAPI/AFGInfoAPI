import { DistrictPndModel } from '@/models/district.pend.model';
import BaseService from './base.service';
import { DistrictPnd } from '@/interfaces/district.interface';

class DistrictPndService extends BaseService<DistrictPnd> {
  public districts = DistrictPndModel;

  constructor() {
    super(DistrictPndModel);
  }
}

export default DistrictPndService;
