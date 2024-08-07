import { RequestWithUser } from '@/interfaces/auth.interface';
import { HotelPnd } from '@/interfaces/hotel.interface';
import HotelPndService from '@/services/hotel.pend.service';
import HotelService from '@/services/hotel.service';
import attachImages from '@/utils/helpers/attachImages';
import { NextFunction, Request, Response } from 'express';
import { Result, validationResult } from 'express-validator';
import fs from 'fs';
import { ObjectId } from 'mongodb';

//Interface for MutlerRequest
interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

class HotelPndController {
  public hotelPndService = new HotelPndService();
  public hotelService = new HotelService();

  public getHotels = async (req: RequestWithUser, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const per_page = parseInt(req.query.per_page as string) || 10;
    const search = req.query.search as string;
    const lang = req.query.lang as string;
    const searchFields = ['en_name', 'dr_name', 'ps_name', 'en_capital', 'dr_capital', 'ps_capital'];
    let status = req.query.status === 'true' ? true : req.query.status === 'false' ? false : undefined;

    if (!req.isAuth) status = true;
    const hasPending = req.query.hasPending === 'true' ? true : req.query.hasPending === 'false' ? false : undefined;
    const province_id = req.query.province as string;
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
          province_id: 1,
        }
      : {};

    const { data, meta } = await this.hotelService.findAll({ page, limit: per_page, search, status, hasPending }, searchFields, projectObj);

    const filteredData = province_id ? data.filter(hotel => hotel.province_id.toString() === province_id) : data;
    // Map images to full URL
    const returnHotel = attachImages(filteredData, ['images']);

    res.status(200).json({
      data: returnHotel,
      meta,
      message: 'findAll',
    });
  };

  public createHotel = async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
      const result: Result = validationResult(req);
      if (!result.isEmpty()) {
        const errorObject = result.array().reduce((acc, cur) => {
          return { ...acc, [cur.path]: cur.msg };
        }, {});

        return res.status(400).json({ errors: errorObject });
      }

      const hotelData = req.body;
      const images = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);

      const location = {
        type: 'Point',
        coordinates: [Number(hotelData.lng), Number(hotelData.lat)],
      };
      const hotel = await this.hotelService.create({ ...hotelData, images, location });
      res.status(201).json({ data: hotel, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getHotelById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const id = req.params.id;
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
      const hotel = await this.hotelService.findById(id, projectObj);

      if (!hotel.status && !req.isAuth) return res.status(404).json({ message: 'Hotel not found' });

      const imageAttached = attachImages([hotel], ['images']);
      res.status(200).json({ data: imageAttached[0], message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public updateHotel = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const result: Result = validationResult(req);
      if (!result.isEmpty()) {
        const errorObject = result.array().reduce((acc, cur) => {
          return { ...acc, [cur.path]: cur.msg };
        }, {});

        return res.status(400).json({ errors: errorObject });
      }

      const hotelData = req.body;
      const images = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);

      const location = {
        type: 'Point',
        coordinates: [Number(hotelData.lng), Number(hotelData.lat)],
      };
      const hotel = await this.hotelService.findById(id);
      if (!hotel) {
        return res.status(404).json({ message: ' hotel not found' });
      }

      const pndhotel = await this.hotelPndService.create({ ...hotelData, images, location, hotel_id: id });
      await this.hotelService.update(id, { hasPending: true });
      res.status(200).json({ data: pndhotel, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public updteHotelImages = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const hotel = (await this.hotelService.findById(id, { images: 1, _id: 1 })) as { images: string[] };
      const images = hotel.images;
      const newImages = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);
      hotel.images = [...images, ...newImages];
      const response = await this.hotelService.update(id, hotel);
      res.status(200).json({ data: response, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteHotel = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const hotel = await this.hotelService.delete(id);
      res.status(200).json({ data: hotel, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public deleteHotelImage = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const image_name = req.params.image_name;

    try {
      const hotel = await this.hotelService.findById(id, { images: 1, _id: 1 });
      const images = hotel.images;
      if (!images.includes(image_name)) {
        return res.status(404).json({ message: 'Image not found' });
      }
      const newImages = images.filter(image => image !== image_name);
      hotel.images = newImages;
      const response = await this.hotelService.update(id, hotel);

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

  public getNearbyHotels = async (req: Request, res: Response, next: NextFunction) => {
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
      const nearbyHotels = await this.hotelService.getNearbyHotels(parseFloat(lat as string), parseFloat(lng as string));

      // Map images to full URL
      const returnHotels = attachImages(nearbyHotels, ['images']);
      res.status(200).json({ data: returnHotels, message: 'findNearby' });
    } catch (error) {
      next(error);
    }
  };

  public approveHotel = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const hasApproved = JSON.parse(req.body.approved);

    try {
      if (hasApproved) {
        const hotel = await this.hotelService.findById(id, {});
        if (!hotel) {
          return res.status(404).json({ message: 'No pending hotel found' });
        }

        if (!hotel?.status) {
          const approvedhotel = await this.hotelService.update(id, { ...hotel, status: true });
          res.status(200).json({ data: approvedhotel, message: 'approved' });
        } else if (hotel.status) {
          res.status(400).json({ message: 'hotel is already approved' });
        }
      } else {
        await this.hotelService.delete(id);
        res.status(200).json({ message: 'rejected' });
      }
    } catch (error) {
      next(error);
    }
  };

  public approveHotelPnd = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const hasApproved = JSON.parse(req.body.approved);

    try {
      if (hasApproved) {
        const pndhotel = (await this.hotelPndService.findById(id, {})) as HotelPnd;
        if (pndhotel?.images.length < 1) {
          delete pndhotel.images;
        }

        delete pndhotel._id;
        const updateHotel = await this.hotelService.update(pndhotel.hotel_id, { ...pndhotel, hasPending: false });

        await this.hotelPndService.delete(id);

        res.status(200).json({ data: updateHotel, message: 'approved' });
      } else {
        const deletedHotel = await this.hotelPndService.delete(id);
        const hotel_id = deletedHotel.hotel_id;
        await this.hotelService.update(hotel_id, { hasPending: false });
        res.status(200).json({ message: 'rejected' });
      }
    } catch (error) {
      next(error);
    }
  };

  public getPendingHotels = async (req: Request, res: Response, next: NextFunction) => {
    const hotelId = req.params.id;
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
      const getPendingHotel = await this.hotelPndService.findOne({ hotel_id: hotelId }, projectObj);

      if (!getPendingHotel) {
        return res.status(404).json({ message: 'No pending hotel found for the provided hotel_id' });
      }

      const imageAttached = attachImages([getPendingHotel], ['images']);
      res.status(200).json({ data: imageAttached[0], message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
}

export default HotelPndController;
