import ParkController from '@/controllers/park.controller';
import { Router } from 'express';
import multer from 'multer';
import { createParkValidation } from '@/middlewares/create.park.imddleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { HttpException } from '@/exceptions/HttpException';
import nearByValidation from '@/middlewares/nearby.validation.middleware';

class ParkRoute {
  public path = '/parks';
  public router = Router();
  public parkController = new ParkController();
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

    uploadRouter.post('/', this.upload.fields(fields), createParkValidation, this.parkController.createPark);
    uploadRouter.patch('/:id', this.upload.fields(fields), createParkValidation, this.parkController.updatePark);
    uploadRouter.delete('/:id', this.parkController.deletePark);
    uploadRouter.patch('/:id/images', this.upload.fields(fields), this.parkController.updateParkImages);
    uploadRouter.delete('/:id/images/:image_name', this.parkController.deleteParkImage);

    // Use the upload router without multer middleware
    this.router.use(`${this.path}`, uploadRouter);

    this.router.get(`${this.path}`, this.parkController.getParks);
    this.router.get(`${this.path}/pending/:id`, this.parkController.getPendingParks);
    this.router.post(`${this.path}/approve_update/:id`, this.parkController.approveParkUpdate);
    this.router.post(`${this.path}/approve/:id`, this.parkController.approvePark);
    this.router.get(`${this.path}/nearbyParks`, nearByValidation, this.parkController.getNearbyParks);
    this.router.get(`${this.path}/:id`, this.parkController.getParkById);
  }
}

export default ParkRoute;
