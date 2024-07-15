import { check } from 'express-validator';

export const createHospitalValidation = [
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
  check('en_address')
    .bail()
    .notEmpty()
    .withMessage('Address is required')
    .bail()
    .isString()
    .withMessage('Address must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Address must be at least 3'),
  check('dr_address')
    .bail()
    .notEmpty()
    .withMessage('Address is required')
    .bail()
    .isString()
    .withMessage('Address must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Address must be at least 3'),
  check('ps_address')
    .bail()
    .notEmpty()
    .withMessage('Address is required')
    .bail()
    .isString()
    .withMessage('Address must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Address must be at least 3'),
  check('email').bail().notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Email must be a valid email'),
  check('phone')
    .bail()
    .notEmpty()
    .withMessage('Phone is required')
    .bail()
    .isString()
    .withMessage('Phone must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Phone must be at least 3'),
  check('ambulancePhone')
    .bail()
    .notEmpty()
    .withMessage('Ambulance Phone is required')
    .bail()
    .isString()
    .withMessage('Ambulance Phone must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Ambulance Phone must be at least 3'),
  check('numberOfBeds').bail().notEmpty().withMessage('Number of Beds is required').bail().isNumeric().withMessage('Number of Beds must be a number'),
  check('website')
    .bail()
    .notEmpty()
    .withMessage('Website is required')
    .bail()
    .isString()
    .withMessage('Website must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Website must be at least 3'),
  check('lat').bail().notEmpty().withMessage('Latitude is required').bail().isNumeric().withMessage('Latitude must be a number'),
  check('lng').bail().notEmpty().withMessage('Longitude is required').bail().isNumeric().withMessage('Longitude must be a number'),
];