import HospitalController from '@/controllers/hospital.controller';
import { Router } from 'express';
import multer from 'multer';
import { createHospitalValidation } from '@/middlewares/create.hospital.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { HttpException } from '@/exceptions/HttpException';
import nearByValidation from '@/middlewares/nearby.validation.middleware';

class HospitalRoute {
  public path = '/hospitals';
  public router = Router();
  public hospitalController = new HospitalController();
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

    uploadRouter.post('/', this.upload.fields(fields), createHospitalValidation, this.hospitalController.createHospital);
    uploadRouter.patch('/:id', this.upload.fields(fields), createHospitalValidation, this.hospitalController.updateHospital);
    uploadRouter.delete('/:id', this.hospitalController.deleteHospital);
    uploadRouter.patch('/:id/images', this.upload.fields(fields), this.hospitalController.updateHospitalImages);
    uploadRouter.delete('/:id/images/:image_name', this.hospitalController.deleteHospitalImage);

    // Use the upload router without multer middleware
    this.router.use(`${this.path}`, uploadRouter);

    this.router.get(`${this.path}`, this.hospitalController.getHospitals);
    this.router.get(`${this.path}/pending/:id`, this.hospitalController.getPendingHospitals);
    this.router.post(`${this.path}/approve_update/:id`, this.hospitalController.approveHospitalPnd);
    this.router.post(`${this.path}/approve/:id`, this.hospitalController.approveHospital);
    this.router.get(`${this.path}/nearbyHospitals`, nearByValidation, this.hospitalController.getNearbyHospitals);
    this.router.get(`${this.path}/:id`, this.hospitalController.getHospitalById);
  }
}

export default HospitalRoute;
