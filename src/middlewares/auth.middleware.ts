import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@models/users.model';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        req.user = findUser;
        req.isAuth = true;
        next();
      } else {
        next(new HttpException(401, 'Unauthenticated'));
      }
    } else {
      if (req.method === 'GET' && !req.path.split('/').includes('pending') && !req.path.split('/').includes('users')) {
        req.isAuth = false;
        next();
        return;
      }
      next(new HttpException(401, 'Unauthenticated'));
    }
  } catch (error) {
    next(new HttpException(401, 'Unauthenticated'));
  }
};

export default authMiddleware;
