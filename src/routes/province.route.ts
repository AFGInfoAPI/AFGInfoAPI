import ProvinceController from '@/controllers/province.controller';
import { Router } from 'express';
import multer from 'multer';
import { createProvinceValidation } from '@/middlewares/create.province.middleware';
import { validateFile } from '@/middlewares/filevalidator.middleware';
import nearByValidation from '@/middlewares/nearby.validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { HttpException } from '@/exceptions/HttpException';

class ProvinceRoute {
  public path = '/provinces';
  public router = Router();
  public provinceController = new ProvinceController();
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

    uploadRouter.post('/', this.upload.fields(fields), createProvinceValidation, this.provinceController.createProvince);
    uploadRouter.patch('/:id', this.upload.fields(fields), createProvinceValidation, this.provinceController.updateProvince);
    uploadRouter.delete('/:id', this.provinceController.deleteProvince);
    uploadRouter.patch('/:id/images', this.upload.fields(fields), this.provinceController.updateProvinceImages);
    uploadRouter.delete('/:id/images/:image_name', this.provinceController.deleteProvinceImage);

    // Use the upload router without multer middleware
    this.router.use(`${this.path}`, uploadRouter);

    this.router.post(`${this.path}/approve/:id`, this.provinceController.approveProvince);
    this.router.get(`${this.path}/nearbyProvinces`, nearByValidation, this.provinceController.getNearbyProvinces);
    this.router.get(`${this.path}`, this.provinceController.getProvinces);
    this.router.get(`${this.path}/:id`, this.provinceController.getProvinceById);
  }
}

export default ProvinceRoute;
