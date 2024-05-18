import { BASE_URL } from '@/config';
import ProvinceService from '@/services/province.service';
import attachImages from '@/utils/helpers/attachImages';
import { NextFunction, Request, Response } from 'express';
import { Result, validationResult } from 'express-validator';
import fs from 'fs';

// Interface for MulterRequest
interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

class ProvinceController {
  public provinceService = new ProvinceService();

  public getProvinces = async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const per_page = parseInt(req.query.per_page as string) || 10;
    const search = req.query.search as string;

    const { provincesData, meta } = await this.provinceService.findAllProvinces(page, per_page, search);

    // Map images to full URL
    const returnProvinces = attachImages(provincesData, ['images']);

    res.status(200).json({
      data: returnProvinces,
      meta,
      message: 'findAll',
    });
  };

  public createProvince = async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
      const result: Result = validationResult(req);
      if (!result.isEmpty()) {
        const errorObject = result.array().reduce((acc, cur) => {
          return { ...acc, [cur.path]: cur.msg };
        }, {});

        return res.status(400).json({ errors: errorObject });
      }

      const provinceData = req.body;
      const images = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);
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

  public updateProvinceImages = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const province = await this.provinceService.findProvinceById(id);
      const images = province.images;
      const newImages = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);
      province.images = [...images, ...newImages];
      const response = await this.provinceService.updateProvince(id, province);
      res.status(200).json({ data: response, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProvince = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const province = await this.provinceService.deleteProvince(id);
      res.status(200).json({ data: province, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProvinceImage = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const image_name = req.params.image_name;

    try {
      const province = await this.provinceService.findProvinceById(id);
      const images = province.images;
      const newImages = images.filter(image => image !== image_name);
      province.images = newImages;
      const response = await this.provinceService.updateProvince(id, province);

      // Delete image from the server
      const path = `uploads/${image_name}`;
      fs.unlink(path, err => {
        if (err) {
          console.error(err);
        }
      });
      res.status(200).json({ data: response, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProvinceController;
