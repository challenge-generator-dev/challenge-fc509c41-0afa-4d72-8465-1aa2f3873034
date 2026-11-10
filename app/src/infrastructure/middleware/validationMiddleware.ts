import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationErrorDTO } from '../../application/dto/CreateOrderDTO';
import { logger } from '../../utils/logger';

export const validationMiddleware = <T extends object>(
  dtoClass: new (...args: unknown[]) => T
) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dtoInstance = plainToInstance(dtoClass, req.body);
      const errors = await validate(dtoInstance as Record<string, unknown>);

      if (errors.length > 0) {
        const validationErrors: { [key: string]: string[] } = {};
        
        for (const error of errors) {
            const fieldMessages: string[] = [];
            if (error.constraints) {
                for (const msg of Object.values(error.constraints)) {
                    fieldMessages.push(msg);
                }
            }
            validationErrors[error.property] = fieldMessages;
        }

        logger.warn('Validation failed', {
          path: req.path,
          method: req.method,
          errors: validationErrors,
        });

        const validationError = new ValidationErrorDTO(
          'Validation failed',
          validationErrors
        );
        next(validationError);
        return;
      }

      (req as Request & { validatedBody: T }).validatedBody = dtoInstance;
      next();
    } catch (error) {
      logger.error('Error in validation middleware', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error);
    }
  };
};