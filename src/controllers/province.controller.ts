import ProvinceService from '@/services/province.service';
import { NextFunction, Request, Response } from 'express';

// Interface for MulterRequest
interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

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

  public createProvince = async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
      const provinceData = req.body;
      const images = req.files.map((file: Express.Multer.File) => file.filename);
      const province = await this.provinceService.createProvince({ ...provinceData, images });
      res.status(201).json({ data: province, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProvinceController;
