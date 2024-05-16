import { check } from 'express-validator';
import fileType from 'file-type';
import fs from 'fs';

export const createProvinceValidation = [
  check('name')
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
  check('governor').bail().notEmpty().withMessage('Governor is required').bail().isString().withMessage('Governor must be a string'),
  check('gdp').bail().notEmpty().withMessage('GDP is required').bail().isNumeric().withMessage('GDP must be a number'),
  check('lat').bail().notEmpty().withMessage('Latitude is required').bail().isNumeric().withMessage('Latitude must be a number'),
  check('lng').bail().notEmpty().withMessage('Longitude is required').bail().isNumeric().withMessage('Longitude must be a number'),
  check('capital').bail().notEmpty().withMessage('Capital is required').bail().isString().withMessage('Capital must be a string'),
  check('description').bail().notEmpty().withMessage('Description is required').bail().isString().withMessage('Description must be a string'),
];
