import DistrictController from '@/controllers/district.controller';
import { Router } from 'express';
import multer from 'multer';

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
        cb(new Error(`${file.fieldname}: File type is not supported`));
      }
    },
  });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Create a new router to handle the upload routes
    const uploadRouter = Router();

    // Generate an array of field configurations for multer
    const fields = Array(10)
      .fill(0)
      .map((_, i) => ({ name: `images[${i}]` }));

    uploadRouter.post('/', this.upload.fields(fields), this.districtController.createDistrict);
    uploadRouter.patch('/:id', this.upload.fields(fields), this.districtController.updateDistrict);
    uploadRouter.delete('/:id', this.districtController.deleteDistrict);
    uploadRouter.patch('/:id/images', this.upload.fields(fields), this.districtController.updateDistrictImages);
    uploadRouter.delete('/:id/images/:image_name', this.districtController.deleteDistrictImage);

    // Use the upload router without multer middleware
    this.router.use(`${this.path}`, uploadRouter);

    this.router.get(`${this.path}`, this.districtController.getDistricts);
    this.router.get(`${this.path}/:id`, this.districtController.getDistrictById);
  }
}

export default DistrictRoute;
