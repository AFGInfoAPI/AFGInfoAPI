import DistrictController from '@/controllers/district.controller';
import { Router } from 'express';
import multer from 'multer';
import { createDistrictValidation } from '@/middlewares/create.district.middleware';
import { validateFile } from '@/middlewares/filevalidator.middleware';
import nearByValidation from '@/middlewares/nearby.validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { HttpException } from '@/exceptions/HttpException';
import authorize from '@/middlewares/authorize.middleware';

class DistrictRoute {
  public path = '/districts';
  public router = Router();
  public districtController = new DistrictController();
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

    uploadRouter.post(
      '/',
      authorize(['admin', 'creator']),
      this.upload.fields(fields),
      createDistrictValidation,
      this.districtController.createDistrict,
    );
    uploadRouter.patch(
      '/:id',
      authorize(['admin', 'creator']),
      this.upload.fields(fields),
      createDistrictValidation,
      this.districtController.updateDistrict,
    );
    uploadRouter.delete('/:id', authorize(['admin', 'auth']), this.districtController.deleteDistrict);
    uploadRouter.patch('/:id/images', authorize(['admin', 'creator']), this.upload.fields(fields), this.districtController.updateDistrictImages);
    uploadRouter.delete('/:id/images/:image_name', authorize(['admin', 'auth']), this.districtController.deleteDistrictImage);

    // Use the upload router without multer middleware
    this.router.use(`${this.path}`, uploadRouter);

    this.router.get(`${this.path}/pending/:id`, authorize(['admin', 'auth', 'creator']), this.districtController.getPendingDistrict);
    this.router.post(`${this.path}/approve_update/:id`, authorize(['admin', 'auth']), this.districtController.approveDistrictUpdate);
    this.router.post(`${this.path}/approve/:id`, authorize(['admin', 'auth']), this.districtController.approveDistrict);
    this.router.get(`${this.path}/nearby`, nearByValidation, this.districtController.getNearbyDistricts);
    this.router.get(`${this.path}`, this.districtController.getDistricts);
    this.router.get(`${this.path}/:id`, this.districtController.getDistrictById);
  }
}

export default DistrictRoute;
