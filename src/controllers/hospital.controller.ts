import { HospitalPnd } from '@/interfaces/hospital.interface';
import HospitalPndService from '@/services/hostipal.pend.service';
import HospitalService from '@/services/hospital.service';
import attachImages from '@/utils/helpers/attachImages';
import { NextFunction, Request, Response } from 'express';
import { Result, validationResult } from 'express-validator';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import { RequestWithUser } from '@/interfaces/auth.interface';

//interface for MuterRequset
interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

class HospitalController {
  public hospitalService = new HospitalService();
  public hospitalPndService = new HospitalPndService();

  public getHospitals = async (req: RequestWithUser, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const per_page = parseInt(req.query.per_page as string) || 10;
    const search = req.query.search as string;
    const lang = req.query.lang as string;
    const searchFields = ['en_name', 'dr_name', 'ps_name', 'en_capital', 'dr_capital', 'ps_capital'];
    let status;
    if (req.query.status === 'true') {
      status = true;
    } else if (req.query.status === 'false') {
      status = false;
    }

    if (!req.isAuth) {
      status = true;
    }
    const province_id = req.query.province as string;
    const hasPending = req.query.hasPending === 'true' ? true : req.query.hasPending === 'false' ? false : undefined;
    const projectObj = lang
      ? {
          _id: 1,
          name: `$${lang}_name`,
          address: `$${lang}_address`,
          numberOfBeds: 1,
          ambulancePhone: 1,
          images: 1,
          email: 1,
          phone: 1,
          rating: 1,
          location: 1,
          googleMapUrl: 1,
          hasPending: 1,
          status: 1,
          province_id: 1,
        }
      : {};
    const { data, meta } = await this.hospitalService.findAll(
      { page, limit: per_page, search, status, province_id: hasPending },
      searchFields,
      projectObj,
    );

    const filtered = province_id ? data.filter(hospital => hospital.province_id.toString() === province_id) : data;
    const returnHospital = attachImages(filtered, ['images']);

    res.status(200).json({ data: returnHospital, meta, message: 'findAll' });
  };

  public createHospital = async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
      const result: Result = validationResult(req);
      if (!result.isEmpty()) {
        const errorObject = result.array().reduce((acc, cur) => {
          return { ...acc, [cur.path]: cur.msg };
        }, {});

        return res.status(400).json({ errors: errorObject });
      }

      const hospitalData = req.body;
      const images = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);

      const location = {
        type: 'Point',
        coordinates: [Number(hospitalData.lng), Number(hospitalData.lat)],
      };
      const hospital = await this.hospitalService.create({ ...hospitalData, images, location });
      res.status(201).json({ data: hospital, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getHospitalById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const lang = req.query.lang as string;
    const projectObj = lang
      ? {
          _id: 1,
          name: `$${lang}_name`,
          address: `$${lang}_address`,
          numberOfBeds: 1,
          ambulancePhone: 1,
          images: 1,
          email: 1,
          phone: 1,
          rating: 1,
          location: 1,
          googleMapUrl: 1,
          hasPending: 1,
          status: 1,
        }
      : {};

    try {
      const hospital = await this.hospitalService.findById(id, projectObj);
      if (!hospital.status) return res.status(404).json({ message: 'hospital not found' });
      const imageAttached = attachImages([hospital], ['images']);
      res.status(200).json({ data: imageAttached[0], message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public updateHospital = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const result: Result = validationResult(req);
      if (!result.isEmpty()) {
        const errorObject = result.array().reduce((acc, cur) => {
          return { ...acc, [cur.path]: cur.msg };
        }, {});

        return res.status(400).json({ errors: errorObject });
      }

      const hospitalData = req.body;
      const images = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);

      const location = {
        type: 'Point',
        coordinates: [Number(hospitalData.lng), Number(hospitalData.lat)],
      };
      const hospital = await this.hospitalService.findById(id);
      if (!hospital) {
        return res.status(404).json({ message: ' hospital not found' });
      }

      const pndhospital = await this.hospitalPndService.create({ ...hospitalData, images, location, hospital_id: id });
      await this.hospitalService.update(id, { hasPending: true });
      res.status(200).json({ data: pndhospital, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public updateHospitalImages = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const hospital = (await this.hospitalService.findById(id, { images: 1, _id: 1 })) as { images: string[] };
      const images = hospital.images;
      const newImages = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);
      hospital.images = [...images, ...newImages];
      const response = await this.hospitalService.update(id, hospital);
      res.status(200).json({ data: response, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteHospital = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const hospital = await this.hospitalService.delete(id);
      res.status(200).json({ data: hospital, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public deleteHospitalImage = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const image_name = req.params.image_name;

    try {
      const hospital = await this.hospitalService.findById(id, { images: 1, _id: 1 });
      const images = hospital.images;
      if (!images.includes(image_name)) {
        return res.status(404).json({ message: 'Image not found' });
      }
      const newImages = images.filter(image => image !== image_name);
      hospital.images = newImages;
      const response = await this.hospitalService.update(id, hospital);

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

  public getNearbyHospitals = async (req: Request, res: Response, next: NextFunction) => {
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
      const nearbyHospitals = await this.hospitalService.getNearbyHospitals(parseFloat(lat as string), parseFloat(lng as string));

      // Map images to full URL
      const returnHospitals = attachImages(nearbyHospitals, ['images']);
      res.status(200).json({ data: returnHospitals, message: 'findNearby' });
    } catch (error) {
      next(error);
    }
  };

  public approveHospital = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const hasApproved = JSON.parse(req.body.approved);

    try {
      if (hasApproved) {
        const hospital = await this.hospitalService.findById(id, {});
        if (!hospital) {
          return res.status(404).json({ message: 'No pending hospital found' });
        }

        if (!hospital?.status) {
          const approvedhospital = await this.hospitalService.update(id, { ...hospital, status: true });
          res.status(200).json({ data: approvedhospital, message: 'approved' });
        } else if (hospital.status) {
          res.status(400).json({ message: 'hospital is already approved' });
        }
      } else {
        await this.hospitalService.delete(id);
        res.status(200).json({ message: 'rejected' });
      }
    } catch (error) {
      next(error);
    }
  };

  public approveHospitalPnd = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const hasApproved = JSON.parse(req.body.approved);

    try {
      if (hasApproved) {
        const pndhospital = (await this.hospitalPndService.findById(id, {})) as HospitalPnd;
        if (pndhospital?.images.length < 1) {
          delete pndhospital.images;
        }

        delete pndhospital._id;
        const updateHospital = await this.hospitalService.update(pndhospital.hospital_id, { ...pndhospital, hasPending: false });

        await this.hospitalPndService.delete(id);

        res.status(200).json({ data: updateHospital, message: 'approved' });
      } else {
        const deleteHospital = await this.hospitalPndService.delete(id);
        const hospital_id = deleteHospital.hospital_id;
        await this.hospitalService.update(hospital_id, { hasPending: false });
        res.status(200).json({ message: 'rejected' });
      }
    } catch (error) {
      next(error);
    }
  };

  public getPendingHospitals = async (req: Request, res: Response, next: NextFunction) => {
    const hospitalId = req.params.id;
    const lang = req.query.lang as string;

    const projectObj = lang
      ? {
          _id: 1,
          name: `$${lang}_name`,
          description: `$${lang}_description`,
          address: `$${lang}_address`,
          images: 1,
          email: 1,
          phone: 1,
          star: 1,
          rating: 1,
          location: 1,
          googleMapUrl: 1,
          hasPending: 1,
          status: 1,
        }
      : {};

    try {
      const getPendingHospitals = await this.hospitalPndService.findOne({ hospital_id: hospitalId }, projectObj);

      if (!getPendingHospitals) {
        return res.status(404).json({ message: 'No pending hostipal found for the provided hospital_id' });
      }
      const imageAttached = attachImages([getPendingHospitals], ['images']);
      res.status(200).json({ data: imageAttached[0], message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
}

export default HospitalController;
