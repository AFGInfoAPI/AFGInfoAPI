import ProvinceService from '@/services/province.service';
import { NextFunction, Request, Response } from 'express';

class ProvinceController {
  public provinceService = new ProvinceService();

  public getProvinces = async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const per_page = parseInt(req.query.per_page as string) || 10;

    try {
      const { provinces, total } = await this.provinceService.findAllProvinces(page, per_page);
      const total_page = Math.ceil(total / per_page);

      res.status(200).json({
        data: provinces,
        meta: {
          total: total,
          current_page: page,
          total_page,
          per_page: per_page,
        },
        message: 'findAll',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ProvinceController;
