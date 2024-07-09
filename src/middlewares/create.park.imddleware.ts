import { check } from 'express-validator';

export const createParkValidation = [
  check('en_name')
    .bail()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isString()
    .withMessage('Name must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3'),
  check('dr_name')
    .bail()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isString()
    .withMessage('Name must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3'),
  check('ps_name')
    .bail()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isString()
    .withMessage('Name must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3'),
  check('lat')
    .bail()
    .notEmpty()
    .withMessage('Latitude is required')
    .bail()
    .isNumeric()
    .withMessage('Latitude must be a number')
    .bail()
    .custom(value => value >= -90 && value <= 90)
    .withMessage('Latitude must be between -90 and 90 degrees'),
  check('lng')
    .bail()
    .notEmpty()
    .withMessage('Longitude is required')
    .bail()
    .isNumeric()
    .withMessage('Longitude must be a number')
    .bail()
    .custom(value => value >= -180 && value <= 180)
    .withMessage('Longitude must be between -180 and 180 degrees'),
  check('googleMapUrl').bail().notEmpty().withMessage('Google Map URL is required').bail().isString().withMessage('Google Map URL must be a string'),
];