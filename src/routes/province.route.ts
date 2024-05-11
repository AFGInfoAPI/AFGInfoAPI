import ProvinceController from '@/controllers/province.controller';
import { Router } from 'express';
import multer from 'multer';

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
  private upload = multer({ storage: this.storage });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Create a new router to handle the upload routes
    const uploadRouter = Router();
    uploadRouter.post('/', this.provinceController.createProvince);
    uploadRouter.patch('/:id', this.provinceController.updateProvince);

    this.router.use(`${this.path}`, this.upload.array('images', 3), uploadRouter);

    this.router.get(`${this.path}`, this.provinceController.getProvinces);
    this.router.get(`${this.path}/:id`, this.provinceController.getProvinceById);
  }
}

export default ProvinceRoute;
