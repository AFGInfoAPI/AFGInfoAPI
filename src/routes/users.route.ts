import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import authorize from '@/middlewares/authorize.middleware';
import multer from 'multer';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();
  private multer = multer();

  constructor() {
    this.router.use(authMiddleware);
    this.router.use(authorize(['admin']));
    this.router.use(this.multer.none());
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, this.usersController.getUserById);
    this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    this.router.patch(`${this.path}/:id`, this.usersController.updateUser);
    this.router.delete(`${this.path}/:id`, this.usersController.deleteUser);
    this.router.patch(`${this.path}/:id/change_role`, this.usersController.change_role);
  }
}

export default UsersRoute;
