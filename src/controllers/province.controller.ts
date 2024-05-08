import ProvinceService from '@/services/province.service';
import { NextFunction, Request, Response } from 'express';

class ProvinceController {
  public provinceService = new ProvinceService();

  public getProvinces = async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const { provinces, total } = await this.provinceService.findAllProvinces(page, limit);
      const total_page = Math.ceil(total / limit);

      res.status(200).json({
        data: provinces,
        meta: {
          total: total,
          current_page: page,
          total_page,
          perPage: limit,
        },
        message: 'findAll',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ProvinceController;
