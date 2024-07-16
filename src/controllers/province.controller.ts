import { RequestWithUser } from '@/interfaces/auth.interface';
import { ProvincePnd } from '@/interfaces/province.interface';
import ProvincePndService from '@/services/province.pend.service';
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
  public provincePndService = new ProvincePndService();

  public getProvinces = async (req: RequestWithUser, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const per_page = parseInt(req.query.per_page as string) || 10;
    const search = req.query.search as string;
    const lang = req.query.lang as string;
    const searchFields = ['en_name', 'dr_name', 'ps_name', 'en_capital', 'dr_capital', 'ps_capital'];
    const hasPending = req.query.hasPending === 'true' ? true : req.query.hasPending === 'false' ? false : undefined;
    let status;
    if (req.query.status === 'true') {
      status = true;
    } else if (req.query.status === 'false') {
      status = false;
    }

    // Check authentication status
    if (!req.isAuth) {
      status = true;
    }

    // If req.query.status is neither 'true' nor 'false', status remains undefined
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
    const { data, meta } = await this.provinceService.findAll({ page, limit: per_page, search, status, hasPending }, searchFields, projectObj);

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

  public getProvinceById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
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
      const province = await this.provinceService.findById(id, projectObj);

      if (!req.isAuth && province?.status === false) {
        return res.status(404).json({ message: 'Not found' });
      }

      const imageAttached = attachImages([province], ['images']);

      res.status(200).json({ data: imageAttached[0], message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public updateProvince = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

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
      const province = await this.provinceService.findById(id);
      if (!province) {
        return res.status(404).json({ message: 'Province not found' });
      }

      const pndProvince = await this.provincePndService.create({ ...provinceData, images, location, province_id: id });
      await this.provinceService.update(id, { hasPending: true });
      res.status(201).json({ data: pndProvince, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateProvinceImages = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const province = (await this.provinceService.findById(id, { images: 1, _id: 1 })) as { images: string[] };
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
    console.log(id, '>>>>>>>>>>>>>>>>>>>>');

    try {
      const province = await this.provinceService.findById(id, { images: 1, _id: 1 });
      // return province;
      const images = province.images;
      if (!images.includes(image_name)) {
        return res.status(404).json({ message: 'image not found' });
      }
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

  public approveProvinceUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const hasApproved = JSON.parse(req.body.approved);

    try {
      if (hasApproved) {
        // Get the province from the pending collection
        const pndProvince = (await this.provincePndService.findById(id, {})) as ProvincePnd;

        if (pndProvince?.images.length < 1) {
          delete pndProvince.images;
        }

        // Delete the _id to avoid _id mutation
        delete pndProvince._id;
        const updatedProvince = await this.provinceService.update(pndProvince.province_id, { ...pndProvince, hasPending: false });

        // Delete the pending province after approval
        await this.provincePndService.delete(id);

        res.status(200).json({ data: updatedProvince, message: 'approved' });
      } else {
        const deletedPndProvince = await this.provincePndService.delete(id);
        const province_id = deletedPndProvince.province_id;
        await this.provinceService.update(province_id, { hasPending: false });
        res.status(200).json({ message: 'rejected' });
      }
    } catch (error) {
      next(error);
    }
  };

  public approveProvince = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const hasApproved = JSON.parse(req.body.approved);

    try {
      if (hasApproved) {
        // Get the province from the province collection
        const province = await this.provinceService.findById(id, {});
        if (!province) {
          return res.status(404).json({ message: 'province not found' });
        }

        if (!province?.status) {
          const approvedProvince = await this.provinceService.update(id, { ...province, status: true });
          res.status(200).json({ data: approvedProvince, message: 'approved' });
        } else if (province.status) {
          res.status(400).json({ message: 'Province is already approved!' });
        }
      } else {
        await this.provinceService.delete(id);
        res.status(200).json({ message: 'rejected' });
      }
    } catch (error) {
      next(error);
    }
  };

  public getPendingProvince = async (req: Request, res: Response, next: NextFunction) => {
    const provincesId = req.params.id;
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
      const pendingProvince = await this.provincePndService.findOne({ province_id: provincesId }, projectObj);

      if (!pendingProvince) {
        return res.status(404).json({ message: 'No pending province found for the provided province_Id' });
      }

      const pndProvinceImages = attachImages([pendingProvince], ['images']);
      console.log(pndProvinceImages, '...................>>>>>>>>>>>>>>>>>>>');

      res.status(200).json({ data: pndProvinceImages[0], message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProvinceController;
