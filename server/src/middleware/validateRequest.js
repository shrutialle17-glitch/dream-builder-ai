import { ZodError } from 'zod';

export const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues.map(err => ({ path: err.path.join('.'), message: err.message }))
      });
    }

    next(error);
  }
};
