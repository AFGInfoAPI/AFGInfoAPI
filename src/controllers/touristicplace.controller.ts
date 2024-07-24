import { RequestWithUser } from '@/interfaces/auth.interface';
import { TouristicPlacePnd } from '@/interfaces/touristicplace.interface';
import TouristicPlacePndService from '@/services/touristicplace.pend.service';
import TouristicPlaceService from '@/services/touristicplace.service';
import attachImages from '@/utils/helpers/attachImages';
import { NextFunction, Request, Response } from 'express';
import { Result, validationResult } from 'express-validator';
import fs from 'fs';
import { ObjectId } from 'mongodb';

// Interface for MuterRequest
interface MuterRequest extends Request {
  files: Express.Multer.File[];
}

class TouristicPlaceController {
  public touristicPlaceService = new TouristicPlaceService();
  public touristicPlacePndService = new TouristicPlacePndService();

  public getTouristicPlaces = async (req: RequestWithUser, res: Response) => {
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

    if (!req.isAuth) {
      status = true;
    }
    const province_id = req.query.province as string;
    const hasPending = req.query.hasPending === 'true' ? true : req.query.hasPending === 'false' ? false : undefined;

    const projectObj = lang
      ? {
          _id: 1,
          name: `$${lang}_name`,
          images: 1,
          description: `$${lang}_description`,
          location: 1,
          isNationalPark: 1,
          googleMapUrl: 1,
          hasPending: 1,
          status: 1,
          province_id: 1,
        }
      : {};

    const { data, meta } = await this.touristicPlaceService.findAll({ page, limit: per_page, search, status, hasPending }, searchFields, projectObj);
    const filtered = province_id ? data.filter(touristicPlace => touristicPlace.province_id.toString() === province_id) : data;
    // Map images to full URL
    const returnTouristicPlaces = attachImages(filtered, ['images']);

    return res.status(200).json({ data: returnTouristicPlaces, meta, message: 'findAll' });
  };

  public createTouristicPlace = async (req: MuterRequest, res: Response, next: NextFunction) => {
    try {
      const result: Result = validationResult(req);
      if (!result.isEmpty()) {
        const errorObject = result.array().reduce((acc, cur) => {
          return { ...acc, [cur.path]: cur.msg };
        }, {});
        return res.status(400).json({ errors: errorObject });
      }

      const touristicPlaceData = req.body;
      const images = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);

      const location = {
        type: 'Point',
        coordinates: [Number(touristicPlaceData.lng), Number(touristicPlaceData.lat)],
      };
      const touristicplace = await this.touristicPlaceService.create({ ...touristicPlaceData, images, location });
      res.status(201).json({ data: touristicplace, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getTouristicPlaceById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const lang = req.query.lang as string;
    const projectObj = lang
      ? {
          _id: 1,
          name: `$${lang}_name`,
          images: 1,
          description: `$${lang}_description`,
          location: 1,
          googleMapUrl: 1,
          isNationalPark: 1,
          hasPending: 1,
          status: 1,
        }
      : {};

    try {
      const touristicplace = await this.touristicPlaceService.findById(id, projectObj);
      if (!touristicplace.status && !req.isAuth) {
        return res.status(404).json({ message: 'not found' });
      }
      const imageAttached = attachImages([touristicplace], ['images']);
      return res.status(200).json({ data: imageAttached[0], message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public updateTouristicPlace = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const result: Result = validationResult(req);
      if (!result.isEmpty()) {
        const errorObject = result.array().reduce((acc, cur) => {
          return { ...acc, [cur.path]: cur.msg };
        }, {});
        return res.status(400).json({ errors: errorObject });
      }
      const touristicPlaceData = req.body;
      const images = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);

      const location = {
        type: 'Point',
        coordinates: [Number(touristicPlaceData.lng), Number(touristicPlaceData.lat)],
      };
      const touristicplace = await this.touristicPlaceService.findById(id);
      if (!touristicplace) {
        return res.status(404).json({ message: 'not found' });
      }

      const pendingTouristicPlace = await this.touristicPlacePndService.create({ ...touristicPlaceData, images, location, touristic_place_id: id });
      await this.touristicPlaceService.update(id, { hasPending: true });
      res.status(201).json({ data: pendingTouristicPlace, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateTouristicPlaceImages = async (req: MuterRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const touristicplace = (await this.touristicPlaceService.findById(id, { images: 1, _id: 1 })) as { images: string[] };
      const images = touristicplace.images;
      const newImages = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);
      touristicplace.images = [...images, ...newImages];
      const response = await this.touristicPlaceService.update(id, touristicplace);
      return res.status(200).json({ data: response, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTouristicPlace = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const touristicplace = await this.touristicPlaceService.delete(id);
      if (!touristicplace) {
        return res.status(404).json({ message: 'not found' });
      }
      return res.status(200).json({ data: touristicplace, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTouristicPlaceImage = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const image = req.params.image_name;

    try {
      const touristicplace = await this.touristicPlaceService.findById(id, { images: 1, _id: 1 });
      const images = touristicplace.images;
      if (!images.includes(image)) {
        return res.status(404).json({ message: 'not found' });
      }
      const newImages = images.filter(img => img !== image);
      touristicplace.images = newImages;
      const response = await this.touristicPlaceService.update(id, touristicplace);
      // Delete image from server
      const path = `./uploads/${image}`;
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

  public getNearbyTouristicPlaces = async (req: Request, res: Response, next: NextFunction) => {
    const result: Result = validationResult(req);

    if (!result.isEmpty()) {
      const errorObject = result.array().reduce((acc, cur) => {
        return { ...acc, [cur.path]: cur.msg };
      }, {});
      return res.status(400).json({ errors: errorObject });
    }

    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'lat, lng, and distance are required' });
    }

    try {
      const getNearbyTouristicPlaces = await this.touristicPlaceService.getNearbyTouristicPlaces(
        parseFloat(lat as string),
        parseFloat(lng as string),
      );

      // Map images to full URL
      const returnTouristicPlaces = attachImages(getNearbyTouristicPlaces, ['images']);
      res.status(200).json({ data: returnTouristicPlaces, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public approveTouristicPlaceUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const hasApproved = JSON.parse(req.body.approved);

    try {
      if (hasApproved) {
        const touristicPlacePnd = (await this.touristicPlacePndService.findById(id, {})) as TouristicPlacePnd;
        if (touristicPlacePnd?.images.length < 1) {
          delete touristicPlacePnd.images;
        }
        delete touristicPlacePnd._id;
        const updateTouristicPlace = await this.touristicPlaceService.update(touristicPlacePnd.touristic_place_id, {
          ...touristicPlacePnd,
          hasPending: false,
          status: true,
        });
        await this.touristicPlacePndService.delete(id);
        res.status(200).json({ data: updateTouristicPlace, message: 'approved' });
      } else {
        const deletedTouristicPlace = await this.touristicPlacePndService.delete(id);
        const touristicplace_id = deletedTouristicPlace.touristic_place_id;
        await this.touristicPlaceService.update(touristicplace_id, { hasPending: false });
        res.status(200).json({ message: 'rejected' });
      }
    } catch (error) {
      next(error);
    }
  };

  public approveTouristicPlace = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const hasApproved = JSON.parse(req.body.approved);

    try {
      if (hasApproved) {
        const touristicPlacePnd = await this.touristicPlaceService.findById(id, {});
        if (!touristicPlacePnd) {
          return res.status(404).json({ message: 'No pending touristic place found' });
        }

        if (!touristicPlacePnd?.status) {
          const updateTouristicPlace = await this.touristicPlaceService.update(id, { ...touristicPlacePnd, status: true });
          res.status(200).json({ data: updateTouristicPlace, message: 'approved' });
        } else if (touristicPlacePnd.status) {
          res.status(200).json({ message: 'already approved' });
        } else {
          await this.touristicPlaceService.delete(id);
          res.status(200).json({ message: 'rejected' });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  public getPendingTouristicPlaces = async (req: Request, res: Response, next: NextFunction) => {
    const touristicPlaceId = req.params.id;
    const lang = req.query.lang as string;

    const projectObj = lang
      ? {
          _id: 1,
          name: `$${lang}_name`,
          images: 1,
          description: `$${lang}_description`,
          location: 1,
          isNationalPark: 1,
          googleMapUrl: 1,
          hasPending: 1,
          status: 1,
        }
      : {};

    try {
      const pendingTouristicPlace = await this.touristicPlacePndService.findOne({ touristicplace_id: touristicPlaceId }, projectObj);

      if (!pendingTouristicPlace) {
        return res.status(404).json({ message: 'No pending touristicPlace found for the provided touristicplace_id' });
      }
      const imageAttached = attachImages([pendingTouristicPlace], ['images']);
      res.status(200).json({ data: imageAttached[0], message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
}

export default TouristicPlaceController;
