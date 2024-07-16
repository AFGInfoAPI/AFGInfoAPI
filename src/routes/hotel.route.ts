import HotelController from '@/controllers/hotel.controller';
import { Router } from 'express';
import multer from 'multer';
import { createHotelValidation } from '@/middlewares/create.hotel.middleware';
import { validateFile } from '@/middlewares/filevalidator.middleware';
import nearByValidation from '@/middlewares/nearby.validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { HttpException } from '@/exceptions/HttpException';
import authorize from '@/middlewares/authorize.middleware';

class HotelRoute {
  public path = '/hotels';
  public router = Router();
  public hotelController = new HotelController();
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

    uploadRouter.post('/', authorize(['admin', 'creator']), this.upload.fields(fields), createHotelValidation, this.hotelController.createHotel);
    uploadRouter.patch('/:id', authorize(['admin', 'creator']), this.upload.fields(fields), createHotelValidation, this.hotelController.updateHotel);
    uploadRouter.delete('/:id', authorize(['admin', 'auth']), this.hotelController.deleteHotel);
    uploadRouter.patch('/:id/images', authorize(['admin', 'auth']), this.upload.fields(fields), this.hotelController.updteHotelImages);
    uploadRouter.delete('/:id/images/:image_name', authorize(['admin', 'auth']), this.hotelController.deleteHotelImage);

    // Use the upload router without multer middleware
    this.router.use(`${this.path}`, uploadRouter);

    this.router.get(`${this.path}/pending/:id`, authorize(['admin', 'creator', 'auth']), this.hotelController.getPendingHotels);
    this.router.post(`${this.path}/approve_update/:id`, authorize(['admin', 'auth']), this.hotelController.approveHotelPnd);
    this.router.post(`${this.path}/approve/:id`, authorize(['admin', 'auth']), this.hotelController.approveHotel);
    this.router.get(`${this.path}/nearby`, nearByValidation, this.hotelController.getNearbyHotels);
    this.router.get(`${this.path}/:id`, this.hotelController.getHotelById);
    this.router.get(`${this.path}`, this.hotelController.getHotels);
  }
}

export default HotelRoute;
