import { NextFunction, Request, Response } from 'express';

export const validateFile = (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (!files || Object.keys(files).length === 0) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  let errors = {};
  for (const field in files) {
    for (const file of files[field]) {
      if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
        errors = { ...errors, [field]: 'Invalid file type' };
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Some files are not supported', errors });
  }

  next();
};
