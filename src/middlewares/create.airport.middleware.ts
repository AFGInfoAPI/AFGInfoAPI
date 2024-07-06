import { check } from 'express-validator';

export const createAirportValidation = [
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
  check('lat').bail().notEmpty().withMessage('Latitude is required').bail().isNumeric().withMessage('Latitude must be a number'),
  check('lng').bail().notEmpty().withMessage('Longitude is required').bail().isNumeric().withMessage('Longitude must be a number'),
  check('googleMapUrl').bail().notEmpty().withMessage('Google map url is required').bail().isString().withMessage('Google map url must be a string'),
  check('en_city').bail().notEmpty().withMessage('English city is required').bail().isString().withMessage('City must be a string'),
  check('dr_city').bail().notEmpty().withMessage('Dari city is required').bail().isString().withMessage('City must be a string'),
  check('ps_city').bail().notEmpty().withMessage('Pashto city is required').bail().isString().withMessage('City must be a string'),
  check('IATA_Code').bail().notEmpty().withMessage('IATA code is required').bail().isString().withMessage('IATA code must be a string'),
  check('numbers_of_terminals')
    .bail()
    .notEmpty()
    .withMessage('Number of terminals is required')
    .bail()
    .isNumeric()
    .withMessage('Number of terminals must be a number'),
];
