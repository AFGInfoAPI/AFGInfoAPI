import ProvinceController from '@/controllers/province.controller';
import { Router } from 'express';

class ProvinceRoute {
  public path = '/provinces';
  public router = Router();
  public provinceController = new ProvinceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.provinceController.getProvinces);
  }
}

export default ProvinceRoute;
