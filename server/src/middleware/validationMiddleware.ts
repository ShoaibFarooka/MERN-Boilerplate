import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';

// Format Yup error function
const formatYupError = (error: Yup.ValidationError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};

  error.inner.forEach((err) => {
    if (err.path) {
      formattedErrors[err.path] = err.message;
    }
  });

  return formattedErrors;
};

// Validate request body
const validateRequest = <T extends Yup.AnyObject>(schema: Yup.ObjectSchema<T>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.validate(req.body, { abortEarly: false, stripUnknown: false });
      const schemaKeys = Object.keys(schema.fields);
      const unknownFields = Object.keys(req.body).filter(field => !schemaKeys.includes(field));

      if (unknownFields.length > 0) {
        res.status(400).json({
          error: 'Request validation failed',
          details: {
            message: 'Unknown fields present in request body',
            fields: unknownFields
          }
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Request Validation Error:', error);
      const formattedErrors = formatYupError(error as Yup.ValidationError);
      res.status(400).json({ error: 'Request validation failed', details: formattedErrors });
      return;
    }
  };
};

// Validate request parameters
const validateParams = <T extends Yup.AnyObject>(schema: Yup.ObjectSchema<T>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.validate(req.params, { abortEarly: false, stripUnknown: false });
      const schemaKeys = Object.keys(schema.fields);
      const unknownFields = Object.keys(req.params).filter(field => !schemaKeys.includes(field));

      if (unknownFields.length > 0) {
        res.status(400).json({
          error: 'Params validation failed',
          details: {
            message: 'Unknown fields present in request params',
            fields: unknownFields
          }
        });
        return;
      }
      next();
    } catch (error) {
      console.error('Params Validation Error:', error);
      const formattedErrors = formatYupError(error as Yup.ValidationError);
      res.status(400).json({ error: 'Params validation failed', details: formattedErrors });
      return;
    }
  }
};

// Validate request query
const validateQuery = <T extends Yup.AnyObject>(schema: Yup.ObjectSchema<T>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.validate(req.query, { abortEarly: false, stripUnknown: false });
      const schemaKeys = Object.keys(schema.fields);
      const unknownFields = Object.keys(req.query).filter(field => !schemaKeys.includes(field));

      if (unknownFields.length > 0) {
        res.status(400).json({
          error: 'Query validation failed',
          details: {
            message: 'Unknown fields present in request query',
            fields: unknownFields
          }
        });
        return;
      }
      next();
    } catch (error) {
      console.error('Query Validation Error:', error);
      const formattedErrors = formatYupError(error as Yup.ValidationError);
      res.status(400).json({ error: 'Query validation failed', details: formattedErrors });
      return;
    }
  }
};

// Validate file uploads
interface ValidateFileOptions {
  required?: boolean;
}

const validateFile = (options: ValidateFileOptions) => (req: Request, res: Response, next: NextFunction) => {
  const { required } = options;

  try {
    if (required && !req.file) {
      res.status(400).json({ error: 'File upload is mandatory' });
      return;
    }

    if (req.file) {
      if (req.file.size > 10 * 1024 * 1024) { // Max file size of 10MB
        res.status(400).json({ error: 'File size too large' });
        return;
      }
      if (!req.file.mimetype.startsWith('image/')) { // Only allow image files
        res.status(400).json({ error: 'File type not allowed' });
        return;
      }
    }
    next();
  } catch (error) {
    console.error('File Validation Error:', error);
    res.status(400).json({ error: 'File validation failed' });
  }
};

export {
  validateParams,
  validateRequest,
  validateQuery,
  validateFile,
};
