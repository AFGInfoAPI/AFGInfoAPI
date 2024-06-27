import e from 'express';
import { check } from 'express-validator';

export const createDistrictValidation = [
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
  check('area').bail().notEmpty().withMessage('Area is required').bail().isNumeric().withMessage('Area must be a number'),
  check('population').bail().notEmpty().withMessage('Population is required').bail().isNumeric().withMessage('Population must be a number'),
  check('en_governor').bail().notEmpty().withMessage('Governor is required').bail().isString().withMessage('Governor must be a string'),
  check('dr_governor').bail().notEmpty().withMessage('Governor is required').bail().isString().withMessage('Governor must be a string'),
  check('ps_governor').bail().notEmpty().withMessage('Governor is required').bail().isString().withMessage('Governor must be a string'),
  check('gdp').bail().notEmpty().withMessage('GDP is required').bail().isNumeric().withMessage('GDP must be a number'),
  check('lat').bail().notEmpty().withMessage('Latitude is required').bail().isNumeric().withMessage('Latitude must be a number'),
  check('lng').bail().notEmpty().withMessage('Longitude is required').bail().isNumeric().withMessage('Longitude must be a number'),
  check('en_capital').bail().notEmpty().withMessage('English capital is required').bail().isString().withMessage('Capital must be a string'),
  check('dr_capital').bail().notEmpty().withMessage('Dari capital is required').bail().isString().withMessage('Capital must be a string'),
  check('ps_capital').bail().notEmpty().withMessage('Pashto capital is required').bail().isString().withMessage('Capital must be a string'),
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
];
