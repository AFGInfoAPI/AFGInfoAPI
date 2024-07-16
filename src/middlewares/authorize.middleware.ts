import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { NextFunction, Response } from 'express';

const authorize = (roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new HttpException(403, 'Forbidden'));
    }
    next();
  };
};

export default authorize;
