import { AirportPnd } from '@/interfaces/airport.interface';
import AirportPndService from '@/services/airport.pend.service';
import AirportService from '@/services/airport.service';
import attachImages from '@/utils/helpers/attachImages';
import { NextFunction, Request, Response } from 'express';
import { Result, validationResult } from 'express-validator';
import fs from 'fs';

//Interface for MulterRequest
interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

class AirportController {
  public airportService = new AirportService();
  public airportPndService = new AirportPndService();

  public getAirports = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const per_page = parseInt(req.query.per_page as string) || 10;
    const search = req.query.search as string;
    const lang = req.query.lang as string;
    const searchFields = ['en_name', 'dr_name', 'ps_name'];
    const status = req.query.status === 'true' || true ? true : req.query.status === 'false' ? false : undefined;
    const projectObj = lang
      ? {
          _id: 1,
          name: `$${lang}_name`,
          city: `$${lang}_city`,
          IATA_Code: 1,
          images: 1,
          location: 1,
          googleMapUrl: 1,
          numbers_of_terminals: 1,
          hasPending: 1,
          status: 1,
        }
      : {};
    const { data, meta } = await this.airportService.findAll({ page, limit: per_page, search, status }, searchFields, projectObj);

    //Map images to full URL
    const returnAirports = attachImages(data, ['images']);

    res.status(200).json({ data: returnAirports, meta, message: 'findAll' });
  };

  public createAirport = async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
      const result: Result = validationResult(req);
      if (!result.isEmpty()) {
        const errorObject = result.array().reduce((acc, cur) => {
          return { ...acc, [cur.path]: cur.msg };
        }, {});

        return res.status(400).json({ errors: errorObject });
      }

      const airportData = req.body;
      const images = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);

      const location = {
        type: 'Point',
        coordinates: [Number(airportData.lng), Number(airportData.lat)],
      };
      const district = await this.airportService.create({ ...airportData, images, location });
      res.status(201).json({ data: district, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getAirportById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const lang = req.query.lang as string;
    const projectObj = lang
      ? {
          _id: 1,
          name: `$${lang}_name`,
          city: `$${lang}_city`,
          IATA_Code: 1,
          images: 1,
          location: 1,
          googleMapUrl: 1,
          numbers_of_terminals: 1,
          hasPending: 1,
          status: 1,
        }
      : {};

    try {
      const data = await this.airportService.findById(id, projectObj);
      res.status(200).json({ data, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public updateAirport = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const result: Result = validationResult(req);
      if (!result.isEmpty()) {
        const errorObject = result.array().reduce((acc, cur) => {
          return { ...acc, [cur.path]: cur.msg };
        }, {});

        return res.status(400).json({ errors: errorObject });
      }

      const airportData = req.body;
      const images = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);

      const location = {
        type: 'Point',
        coordinates: [Number(airportData.lng), Number(airportData.lat)],
      };
      const airport = await this.airportService.findById(id);
      if (!airport) {
        return res.status(404).json({ message: ' airport not found' });
      }

      const AirportPnd = await this.airportPndService.create({ ...airportData, images, location, airport_id: id });
      await this.airportService.update(id, { hasPending: true });
      res.status(200).json({ data: AirportPnd, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public updateAirportImages = async (req: MulterRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const airport = (await this.airportService.findById(id, { images: 1, _id: 1 })) as { images: string[] };
      const images = airport.images;
      const newImages = Object.keys(req.files).reduce((acc, key) => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          acc.push(req.files[key][0].filename);
        }
        return acc;
      }, []);
      airport.images = [...images, ...newImages];
      const response = await this.airportService.update(id, airport);
      res.status(200).json({ data: response, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteAirportImages = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const image_name = req.params.image_name;

    try {
      const airport = await this.airportService.findById(id, { images: 1, _id: 1 });
      const images = airport.images;
      if (!images.includes(image_name)) {
        return res.status(404).json({ message: 'Image not found' });
      }
      const newImages = images.filter(image => image !== image_name);
      airport.images = newImages;
      const response = await this.airportService.update(id, airport);

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

  public deleteAirport = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const airport = await this.airportService.delete(id);
      res.status(200).json({ data: airport, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getNearbyAirport = async (req: Request, res: Response, next: NextFunction) => {
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
      const nearbyProvinces = await this.airportService.getNearbyAirports(parseFloat(lat as string), parseFloat(lng as string));

      // Map images to full URL
      const returnAirports = attachImages(nearbyProvinces, ['images']);
      res.status(200).json({ data: returnAirports, message: 'findNearby' });
    } catch (error) {
      next(error);
    }
  };

  public approveAirportUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const hasApproved = req.body.approved;

    try {
      if (hasApproved) {
        const pndAirport = (await this.airportPndService.findById(id, {})) as AirportPnd;
        if (!pndAirport) {
          return res.status(404).json({ message: 'No pending district found' });
        }

        delete pndAirport._id;
        const updateAirport = await this.airportService.update(pndAirport.airport_id, { ...pndAirport, hasPending: false });

        await this.airportPndService.delete(id);

        res.status(200).json({ data: updateAirport, message: 'approved' });
      } else {
        await this.airportPndService.delete(id);
        res.status(200).json({ message: 'rejected' });
      }
    } catch (error) {
      next(error);
    }
  };

  public approveAirport = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const hasApproved = req.body.approved;

    try {
      if (hasApproved) {
        const airport = await this.airportService.findById(id, {});
        if (!airport) {
          return res.status(404).json({ message: 'No pending airport found' });
        }

        if (!airport?.status) {
          const approvedairport = await this.airportService.update(id, { ...airport, status: true });
          res.status(200).json({ data: approvedairport, message: 'approved' });
        } else if (airport.status) {
          res.status(400).json({ message: 'airport is already approved' });
        }
      } else {
        await this.airportService.delete(id);
        res.status(200).json({ message: 'rejected' });
      }
    } catch (error) {
      next(error);
    }
  };

  public getPendingAirports = async (req: Request, res: Response, next: NextFunction) => {
    const airportId = req.params.id;
    const lang = req.query.lang as string;

    const projectObj = lang
      ? {
          _id: 1,
          name: `$${lang}_name`,
          city: `$${lang}_city`,
          IATA_Code: 1,
          images: 1,
          location: 1,
          googleMapUrl: 1,
          numbers_of_terminals: 1,
          hasPending: 1,
          status: 1,
        }
      : {};

    try {
      const getPendingAirport = await this.airportPndService.findOne({ airport_id: airportId }, projectObj);

      if (!getPendingAirport) {
        return res.status(404).json({ message: 'No pending airport found for the provided airport_id' });
      }

      res.status(200).json({ data: getPendingAirport, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
}
export default AirportController;
