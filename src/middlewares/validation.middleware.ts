import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { HttpException } from '@exceptions/HttpException';

const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = false, // Set whitelist to false to allow extra fields
  forbidNonWhitelisted = false, // Also set forbidNonWhitelisted to false
): RequestHandler => {
  return (req, res, next) => {
    validate(plainToClass(type, req[value]), { skipMissingProperties, whitelist, forbidNonWhitelisted }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const errorsObject = errors.reduce((acc, error) => {
          const errorMessage = Object.values(error.constraints)[0]; // Taking the first error message
          acc[error.property] = errorMessage;
          return acc;
        }, {});

        next(
          new HttpException(400, 'Validation failed', {
            errors: errorsObject,
          }),
        );
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;
