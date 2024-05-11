import { BASE_URL } from '@/config';
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

      // Map images to full URL
      const returnProvinces = provinces.map(province => {
        return {
          ...province,
          images: province.images.map(image => {
            return `${BASE_URL}/uploads/${image}`;
          }),
        };
      });

      // Calculate total pages for pagination
      const total_page = Math.ceil(total / per_page);

      res.status(200).json({
        data: returnProvinces,
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

  public getProvinceById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const province = await this.provinceService.findProvinceById(id);

      // Map images to full URL
      const returnProvince = {
        ...province,
        images: province.images.map(image => {
          return `${BASE_URL}/uploads/${image}`;
        }),
      };

      res.status(200).json({ data: returnProvince, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public updateProvince = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const provinceData = req.body;

    try {
      const province = await this.provinceService.updateProvince(id, provinceData);
      res.status(200).json({ data: province, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProvinceController;
