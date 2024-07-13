import { ParkPnd } from '@/interfaces/park.interface';
import ParkPndService from '@/services/park.pend.service';
import ParkService from '@/services/park.service';
import attachImages from '@/utils/helpers/attachImages';
import { NextFunction, Request, Response } from 'express';
import { Result, validationResult } from 'express-validator';
import fs from 'fs';
import { ObjectId } from 'mongodb';

//Interface for MulterRequest
interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

class ParkController {
  public parkService = new ParkService();
  public parkPndService = new ParkPndService();

  getParks = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const per_page = parseInt(req.query.per_page as string) || 10;
    const search = req.query.search as string;
    const lang = req.query.lang as string;
    const searchFields = ['en_name', 'dr_name', 'ps_name'];
    let status;
    if (req.query.status === 'true') {
      status = true;
    } else if (req.query.status === 'false') {
      status = false;
    }
    const hasPending = req.query.hasPending === 'true' ? true : req.query.hasPending === 'false' ? false : undefined;
    const province_id = req.query.province_id as string;
    const projectObj = lang
      ? {
          _id: 1,
          name: `$${lang}_name`,
          images: 1,
          location: 1,
          googleMapUrl: 1,
          hasPending: 1,
          status: 1,
          province_id: 1,
        }
      : {};
    const { data, meta } = await this.parkService.findAll(
      { page, limit: per_page, search, status, province_id: hasPending },
      searchFields,
      projectObj,
    );
    const filtered = data.filter((park: any) => park.province_id.toString() === province_id);
    // Map images to full URL
    const returnParl = attachImages(filtered, ['images']);

    res.status(200).json({
      data: returnParl,
      meta,
      message: 'findAll',
    });
  };

  public createPark = async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
      const result: Result = validationResult(req);
      if (!result.isEmpty()) {
        const errorObject = result.array().reduce((acc, cur) => {
          return { ...acc, [cur.path]: cur.msg };
        }, {});

        return res.status(400).json({ errors: errorObject });
      }

      const parkData = req.body;
      const images = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);

      const location = {
        type: 'Point',
        coordinates: [Number(parkData.lng), Number(parkData.lat)],
      };
      const park = await this.parkService.create({ ...parkData, images, location });
      res.status(201).json({ data: park, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getParkById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const lang = req.query.lang as string;
    const projectObj = lang
      ? {
          _id: 1,
          name: `$${lang}_name`,
          images: 1,
          location: 1,
          googleMapUrl: 1,
          hasPending: 1,
          status: 1,
        }
      : {};

    try {
      const data = await this.parkService.findById(id, projectObj);
      const imageAttached = attachImages([data], ['images']);
      res.status(200).json({ data: imageAttached[0], message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public updatePark = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const result: Result = validationResult(req);
      if (!result.isEmpty()) {
        const errorObject = result.array().reduce((acc, cur) => {
          return { ...acc, [cur.path]: cur.msg };
        }, {});

        return res.status(400).json({ errors: errorObject });
      }

      const parkData = req.body;
      const images = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);

      const location = {
        type: 'Point',
        coordinates: [Number(parkData.lng), Number(parkData.lat)],
      };
      const park = await this.parkService.findById(id);
      if (!park) {
        return res.status(404).json({ message: ' park not found' });
      }

      const pndPark = await this.parkPndService.create({ ...parkData, images, location, park_id: id });
      await this.parkService.update(id, { hasPending: true });
      res.status(200).json({ data: pndPark, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public updateParkImages = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const park = (await this.parkService.findById(id, { images: 1, _id: 1 })) as { images: string[] };
      const images = park.images;
      const newImages = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);
      park.images = [...images, ...newImages];
      const response = await this.parkService.update(id, park);
      res.status(200).json({ data: response, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteParkImage = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const image_name = req.params.image_name;

    try {
      const park = await this.parkService.findById(id, { images: 1, _id: 1 });
      const images = park.images;
      if (!images.includes(image_name)) {
        return res.status(404).json({ message: 'Image not found' });
      }
      const newImages = images.filter(image => image !== image_name);
      park.images = newImages;
      const response = await this.parkService.update(id, park);

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

  public deletePark = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const park = await this.parkService.delete(id);
      res.status(200).json({ data: park, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getNearbyParks = async (req: Request, res: Response, next: NextFunction) => {
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
      const getNearbyParks = await this.parkService.getNearbyParks(parseFloat(lat as string), parseFloat(lng as string));

      // Map images to full URL
      const returnPark = attachImages(getNearbyParks, ['images']);
      res.status(200).json({ data: returnPark, message: 'findNearby' });
    } catch (error) {
      next(error);
    }
  };

  public approveParkUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const hasApproved = JSON.parse(req.body.approved);

    try {
      if (hasApproved) {
        //get the pending district
        const pndPark = (await this.parkPndService.findById(id, {})) as ParkPnd;
        if (pndPark.images.length < 1) {
          delete pndPark.images;
        }

        //delete the _id to avoid id duplication
        delete pndPark._id;
        const updatePark = await this.parkService.update(pndPark.park_id, { ...pndPark, hasPending: false });

        //delete the pending district after approval
        await this.parkPndService.delete(id);

        res.status(200).json({ data: updatePark, message: 'approved' });
      } else {
        const deletedPark = await this.parkPndService.delete(id);
        const park_Id = deletedPark.park_id;
        await this.parkService.update(park_Id, { hasPending: false });
        res.status(200).json({ message: 'rejected' });
      }
    } catch (error) {
      next(error);
    }
  };

  public approvePark = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const hasApproved = JSON.parse(req.body.approved);

    try {
      if (hasApproved) {
        const park = await this.parkService.findById(id, {});
        if (!park) {
          return res.status(404).json({ message: 'No pending park found' });
        }

        if (!park?.status) {
          const approvedpark = await this.parkService.update(id, { ...park, status: true });
          res.status(200).json({ data: approvedpark, message: 'approved' });
        } else if (park.status) {
          res.status(400).json({ message: 'park is already approved' });
        }
      } else {
        await this.parkService.delete(id);
        res.status(200).json({ message: 'rejected' });
      }
    } catch (error) {
      next(error);
    }
  };

  public getPendingParks = async (req: Request, res: Response, next: NextFunction) => {
    const parkId = req.params.id;
    const lang = req.query.lang as string;

    const projectObj = lang
      ? {
          _id: 1,
          name: `$${lang}_name`,
          images: 1,
          location: 1,
          googleMapUrl: 1,
          hasPending: 1,
          status: 1,
        }
      : {};

    try {
      const pendingPark = await this.parkPndService.findOne({ park_id: parkId }, projectObj);

      if (!pendingPark) {
        return res.status(404).json({ message: 'No pending park found for the provided park_Id' });
      }
      const imageAttached = attachImages([pendingPark], ['images']);
      res.status(200).json({ data: imageAttached[0], message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
}

export default ParkController;
