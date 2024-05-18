import { check } from 'express-validator';

const nearByValidation = [
  check('lat').bail().notEmpty().withMessage('Latitude is required').bail().isNumeric().withMessage('Latitude must be a number'),
  check('lng').bail().notEmpty().withMessage('Longtitude is required').bail().isNumeric().withMessage('Longtitude must be a number'),
];

export default nearByValidation;
