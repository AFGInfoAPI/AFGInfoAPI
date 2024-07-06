import AirportController from '@/controllers/airport.controller';
import { Router } from 'express';
import multer from 'multer';
import { createAirportValidation } from '@/middlewares/create.airport.middleware';
import { validateFile } from '@/middlewares/filevalidator.middleware';
import nearByValidation from '@/middlewares/nearby.validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { HttpException } from '@/exceptions/HttpException';

class AirportRoute {
  public path = '/airports';
  public router = Router();
  public airportController = new AirportController();
  private storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + file.originalname);
    },
  });

  private upload = multer({
    storage: this.storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
      } else {
        cb(new HttpException(400, 'File type is not supported', { [file.fieldname]: 'File type is not supported' }));
      }
    },
  });

  constructor() {
    this.router.use(authMiddleware);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Create a new router to handle the upload routes
    const uploadRouter = Router();

    // Generate an array of field configurations for multer
    const fields = Array(10)
      .fill(0)
      .map((_, i) => ({ name: `images[${i}]` }));

    uploadRouter.post('/', this.upload.fields(fields), createAirportValidation, this.airportController.createAirport);
    uploadRouter.patch('/:id', this.upload.fields(fields), createAirportValidation, this.airportController.updateAirport);
    uploadRouter.delete('/:id', this.airportController.deleteAirport);
    uploadRouter.patch('/:id/images', this.upload.fields(fields), this.airportController.updateAirportImages);
    uploadRouter.delete('/:id/images/:image_name', this.airportController.deleteAirportImages);

    // Use the upload router without multer middleware
    this.router.use(`${this.path}`, uploadRouter);

    this.router.get(`${this.path}/pending/:id`, this.airportController.getPendingAirports);
    this.router.post(`${this.path}/approve_update/:id`, this.airportController.approveAirportUpdate);
    this.router.post(`${this.path}/approve/:id`, this.airportController.approveAirport);
    this.router.get(`${this.path}/nearby/:id`, nearByValidation, this.airportController.getNearbyAirport);
    this.router.get(`${this.path}/:id`, this.airportController.getAirportById);
    this.router.get(`${this.path}`, this.airportController.getAirports);
  }
}

export default AirportRoute;
