import TouristicPlaceController from '@/controllers/touristicplace.controller';
import { Router } from 'express';
import multer from 'multer';
import { createTouristicPlaceValidation } from '@/middlewares/create.touristicplace.middleware';
import { validateFile } from '@/middlewares/filevalidator.middleware';
import nearByValidation from '@/middlewares/nearby.validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { HttpException } from '@/exceptions/HttpException';

class TouristicPlaceRoute {
  public path = '/touristicplaces';
  public router = Router();
  public touristicPlaceController = new TouristicPlaceController();
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

    uploadRouter.post('/', this.upload.fields(fields), createTouristicPlaceValidation, this.touristicPlaceController.createTouristicPlace);
    uploadRouter.patch('/:id', this.upload.fields(fields), createTouristicPlaceValidation, this.touristicPlaceController.updateTouristicPlace);
    uploadRouter.delete('/:id', this.touristicPlaceController.deleteTouristicPlace);
    uploadRouter.patch('/:id/images', this.upload.fields(fields), this.touristicPlaceController.updateTouristicPlaceImages);
    uploadRouter.delete('/:id/images/:image_name', this.touristicPlaceController.deleteTouristicPlaceImage);

    // Use the upload router without multer middleware
    this.router.use(`${this.path}`, uploadRouter);

    this.router.get(`${this.path}`, this.touristicPlaceController.getTouristicPlaces);
    this.router.get(`${this.path}/pending/:id`, this.touristicPlaceController.getPendingTouristicPlaces);
    this.router.post(`${this.path}/approve_update/:id`, this.touristicPlaceController.approveTouristicPlaceUpdate);
    this.router.post(`${this.path}/approve/:id`, this.touristicPlaceController.approveTouristicPlace);
    this.router.get(`${this.path}/nearbyTouristicPlaces`, nearByValidation, this.touristicPlaceController.getNearbyTouristicPlaces);
    this.router.get(`${this.path}/:id`, this.touristicPlaceController.getTouristicPlaceById);
  }
}

export default TouristicPlaceRoute;
