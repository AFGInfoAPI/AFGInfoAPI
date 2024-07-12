import { check } from 'express-validator';

export const createTouristicPlaceValidation = [
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
  check('en_description')
    .bail()
    .notEmpty()
    .withMessage('English description is required')
    .bail()
    .isString()
    .withMessage('Description must be a string'),
  check('dr_description').bail().notEmpty().withMessage('Dari description is required').bail().isString().withMessage('Description must be a string'),
  check('ps_description')
    .bail()
    .notEmpty()
    .withMessage('Pashto description is required')
    .bail()
    .isString()
    .withMessage('Description must be a string'),
  check('lat').bail().notEmpty().withMessage('Latitude is required').bail().isNumeric().withMessage('Latitude must be a number'),
  check('lng').bail().notEmpty().withMessage('Longitude is required').bail().isNumeric().withMessage('Longitude must be a number'),
  check('isNationalPark').bail().optional().isBoolean().withMessage('isNationalPark must be a booleanss'),
];
