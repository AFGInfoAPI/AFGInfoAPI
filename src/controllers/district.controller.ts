import { BASE_URL } from '@/config';
import { DistrictPnd } from '@/interfaces/district.interface';
import DistrictPndService from '@/services/district.pend.service';
import DistrictService from '@/services/district.service';
import attachImages from '@/utils/helpers/attachImages';
import { NextFunction, Request, Response } from 'express';
import { Result, validationResult } from 'express-validator';
import fs from 'fs';

// Interface for MulterRequest
interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

class DistrictController {
  public districtService = new DistrictService();
  public districtPndService = new DistrictPndService();

  public getDistricts = async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const per_page = parseInt(req.query.per_page as string) || 10;
    const search = req.query.search as string;
    const lang = req.query.lang as string;
    const searchFields = ['en_name', 'dr_name', 'ps_name', 'en_capital', 'dr_capital', 'ps_capital'];
    const projectObj = lang
      ? {
          _id: 1,
          name: `$${lang}_name`,
          capital: `$${lang}_capital`,
          images: 1,
          description: `$${lang}_description`,
          area: 1,
          population: 1,
          gdp: 1,
          location: 1,
          googleMapUrl: 1,
          governor: `$${lang}_governor`,
          hasPending: 1,
          status: 1,
        }
      : {};
    const { data, meta } = await this.districtService.findAll(page, per_page, search, searchFields, projectObj);

    // Map images to full URL
    // const returnDistricts = attachImages(data, ['images']);

    res.status(200).json({
      data: data,
      meta,
      message: 'findAll',
    });
  };

  public createDistrict = async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
      const result: Result = validationResult(req);
      if (!result.isEmpty()) {
        const errorObject = result.array().reduce((acc, cur) => {
          return { ...acc, [cur.path]: cur.msg };
        }, {});
        return res.status(400).json({ errors: errorObject });
      }

      const districtData = req.body;
      const images = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);

      const location = {
        type: 'Point',
        coordinates: [Number(districtData.lng), Number(districtData.lat)],
      };
      const district = await this.districtService.create({ ...districtData, images, location });
      res.status(201).json({ data: district, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
  public getDistrictById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const lang = req.query.lang as string;
    const projectObj = lang
      ? {
          _id: 1,
          name: `$${lang}_name`,
          capital: `$${lang}_capital`,
          images: 1,
          description: `$${lang}_description`,
          area: 1,
          population: 1,
          gdp: 1,
          location: 1,
          googleMapUrl: 1,
          governor: `$${lang}_governor`,
          hasPending: 1,
          status: 1,
        }
      : {};

    try {
      const data = await this.districtService.findById(id, projectObj);
      res.status(200).json({ data, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public updateDistrict = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const result: Result = validationResult(req);
      if (!result.isEmpty()) {
        const errorObject = result.array().reduce((acc, cur) => {
          return { ...acc, [cur.path]: cur.msg };
        }, {});
        return res.status(400).json({ errors: errorObject });
      }

      const districtData = req.body;
      const images = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);

      const location = {
        type: 'Point',
        coordinates: [Number(districtData.lng), Number(districtData.lat)],
      };
      const district = await this.districtService.findById(id);
      if (!district) {
        return res.status(404).json({ message: ' district not found' });
      }

      const pndDistrict = await this.districtPndService.create({ ...districtData, images, location, district_id: id });
      await this.districtService.update(id, { hasPending: true });
      res.status(200).json({ data: pndDistrict, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public updateDistrictImages = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const district = (await this.districtService.findById(id, { images: 1, _id: 1 })) as { images: string[] };
      const images = district.images;
      const newImages = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);
      district.images = [...images, ...newImages];
      const response = await this.districtService.update(id, district);
      res.status(200).json({ data: response, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteDistrict = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const district = await this.districtService.delete(id);
      res.status(200).json({ data: district, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public deleteDistrictImage = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const image_name = req.params.image_name;

    try {
      const district = await this.districtService.findById(id, { images: 1, _id: 1 });
      const images = district.images;
      const newImages = images.filter(image => image !== image_name);
      district.images = newImages;
      const response = await this.districtService.update(id, district);

      // Delete image from uploads folder
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

  public getNearbyDistricts = async (req: Request, res: Response, next: NextFunction) => {
    const result: Result = validationResult(req);

    if (!result.isEmpty()) {
      const errorObject = result.array().reduce((acc, cur) => {
        return { ...acc, [cur.path]: cur.msg };
      }, {});

      return res.status(400).json({ errors: errorObject });
    }

    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Plaese provide the latitude and longitude' });
    }

    try {
      const nearbyProvinces = await this.districtService.getNearbyDistrict(parseFloat(lat as string), parseFloat(lng as string));

      // Map images to full URL
      const returnDistricts = attachImages(nearbyProvinces, ['images']);
      res.status(200).json({ data: returnDistricts, message: 'findNearby' });
    } catch (error) {
      next(error);
    }
  };

  public approveDistrict = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const hasApproved = req.body.approved;

    try {
      if (hasApproved) {
        const pndDistrict = (await this.districtPndService.findById(id, {})) as DistrictPnd;
        if (!pndDistrict) {
          return res.status(404).json({ message: 'No pending district found' });
        }

        //delete the _id to avoid id duplication
        delete pndDistrict._id;
        const updateDistrict = await this.districtService.update(pndDistrict.district_id, { ...pndDistrict, hasPending: false });

        //delete the pending district after approval
        await this.districtPndService.delete(id);
        res.status(200).json({ data: updateDistrict, message: 'approved' });
      } else {
        await this.districtPndService.delete(id);
        res.status(200).json({ message: 'rejected' });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default DistrictController;
