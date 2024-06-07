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
    const lang = req.query.lang as string;
    const searchFields = ['en_name', 'dr_name', 'ps_name', 'en_capital', 'dr_capital', 'ps_capital'];
    const projectObj = lang ? { _id: 1, name: `$${lang}_name`, capital: `$${lang}_capital`, images: 1 } : {};
    console.log('projectObj:==================', projectObj);
    const { data, meta } = await this.provinceService.findAll(page, per_page, search, searchFields, projectObj);

    // Map images to full URL
    const returnProvinces = attachImages(data, ['images']);

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

      const location = {
        type: 'Point',
        coordinates: [Number(provinceData.lng), Number(provinceData.lat)],
      };
      const province = await this.provinceService.create({ ...provinceData, images, location });
      res.status(201).json({ data: province, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getProvinceById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const lang = req.query.lang as string;

    try {
      const province = await this.provinceService.findById(id, { name: `$${lang}_name`, capital: 1, images: 1, governer: 1, area: 1 });

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
      const province = await this.provinceService.update(id, provinceData);
      res.status(200).json({ data: province, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public updateProvinceImages = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const province = await this.provinceService.findById(id);
      const images = province.images;
      const newImages = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);
      province.images = [...images, ...newImages];
      const response = await this.provinceService.update(id, province);
      res.status(200).json({ data: response, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProvince = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const province = await this.provinceService.delete(id);
      res.status(200).json({ data: province, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProvinceImage = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const image_name = req.params.image_name;

    try {
      const province = await this.provinceService.findById(id);
      const images = province.images;
      const newImages = images.filter(image => image !== image_name);
      province.images = newImages;
      const response = await this.provinceService.update(id, province);

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

  public getNearbyProvinces = async (req: Request, res: Response, next: NextFunction) => {
    const results: Result = validationResult(req);

    if (!results.isEmpty()) {
      const errorObject = results.array().reduce((acc, cur) => {
        return { ...acc, [cur.path]: cur.msg };
      }, {});

      return res.status(400).json({ errors: errorObject });
    }

    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Please provide latitude and longitude' });
    }

    try {
      const nearbyProvinces = await this.provinceService.getNearbyProvinces(parseFloat(lat as string), parseFloat(lng as string));

      // Map images to full URL
      const returnProvinces = attachImages(nearbyProvinces, ['images']);
      res.status(200).json({ data: returnProvinces, message: 'findNearby' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProvinceController;
