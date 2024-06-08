import { BASE_URL } from '@/config';
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

  public getDistricts = async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const per_page = parseInt(req.query.per_page as string) || 10;
    const search = req.query.search as string;
    const searchFields = ['en_name', 'dr_name', 'ps_name', 'en_capital', 'en_capital', 'dr_capital', 'ps_capital'];
    const lang = (req.query.lang as string) || 'en';

    // Fields to be selected
    const projectObj =
      lang === 'all'
        ? {}
        : {
            _id: 1,
            name: `$${lang}_name`,
            capital: `$${lang}_capital`,
            description: `$${lang}_description`,
            images: ``,
            location: 1,
            area: 1,
            population: 1,
            gdp: 1,
            googleMapUrl: 1,
          };

    const { data: districtsData, meta } = await this.districtService.findAll(page, per_page, search, searchFields, projectObj);

    // Map images to full URL
    const returnDistricts = attachImages(districtsData, ['images']);

    res.status(200).json({
      data: returnDistricts,
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
    const districtId = req.params.id;
    const lang = (req.query.lang as string) || 'en';
    const projectObj =
      lang !== 'all'
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
          }
        : {};
    const district = await this.districtService.findById(districtId, projectObj);

    if (district) {
      res.status(200).json({ data: district, message: 'findOne' });
    } else {
      res.status(404).json({ message: 'District not found' });
    }
  };

  public updateDistrict = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const districtId = req.params.id;
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
    const updatedDistrict = await this.districtService.update(districtId, { ...districtData, images, location });

    if (updatedDistrict) {
      res.status(200).json({ data: updatedDistrict, message: 'updated' });
    } else {
      res.status(404).json({ message: 'District not found' });
    }
  };

  public deleteDistrict = async (req: Request, res: Response, next: NextFunction) => {
    const districtId = req.params.id;

    const district = await this.districtService.findById(districtId, {});
    const images = district ? district.images : null;
    const deletedDistrict = await this.districtService.delete(districtId);

    if (deletedDistrict) {
      // Delete images from the server
      if (images) {
        images.forEach((image: string) => {
          fs.unlink(`uploads/${image}`, err => {
            if (err) {
              console.error(err);
            }
          });
        });
      }
      res.status(200).json({ data: deletedDistrict, message: 'deleted' });
    } else {
      res.status(404).json({ message: 'District not found' });
    }
  };

  public updateDistrictImages = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const districtId = req.params.id;

    try {
      const district = await this.districtService.findById(districtId, {});
      const images = district.images;
      const newImages = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);
      district.images = [...images, ...newImages];
      const updatedDistrict = await this.districtService.update(districtId, district);
      res.status(200).json({ data: updatedDistrict, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteDistrictImage = async (req: Request, res: Response, next: NextFunction) => {
    const districtId = req.params.id;
    const imageName = req.params.imageName;

    const district = await this.districtService.findById(districtId, {});

    if (district) {
      const updatedImages = district.images.filter(image => image !== imageName);
      const updatedDistrict = await this.districtService.update(districtId, { ...district, images: updatedImages });

      if (updatedDistrict) {
        fs.unlink(`uploads/${imageName}`, err => {
          if (err) {
            next(err);
          }
        });

        res.status(200).json({ data: updatedDistrict, message: 'deleted' });
      } else {
        res.status(404).json({ message: 'District not found' });
      }
    } else {
      res.status(404).json({ message: 'District not found' });
    }
  };

  public getNearbyDistricts = async (req: Request, res: Response, next: NextFunction) => {
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
      const nearbyDistricts = await this.districtService.getNearestDistricts(parseFloat(lat as string), parseFloat(lng as string));

      // Map images to full URL
      const returnProvinces = attachImages(nearbyDistricts, ['images']);
      res.status(200).json({ data: returnProvinces, message: 'findNearby' });
    } catch (error) {
      next(error);
    }
  };
}

export default DistrictController;
