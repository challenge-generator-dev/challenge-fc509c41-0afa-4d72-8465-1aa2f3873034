import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { ValidationErrorDTO } from '../../application/dto/CreateOrderDTO';
import { NotFoundErrorDTO } from '../../application/dto/CreateOrderDTO';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'Internal Server Error';

  logger.error(`Error occurred: ${errorMessage}`, {
    statusCode,
    stack: err.stack,
    name: err.name,
  });

  if (err instanceof ValidationErrorDTO) {
    res.status(400).json({
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (err instanceof NotFoundErrorDTO) {
    res.status(404).json({
      message: err.message,
    });
    return;
  }

  if (err.name === 'ValidationError' || statusCode === 400) {
    res.status(400).json({
      message: 'Validation failed',
      errors: [{ field: 'request', message: errorMessage }],
    });
    return;
  }

  if (err.name === 'UnauthorizedError' || statusCode === 401) {
    res.status(401).json({
      message: 'Unauthorized access',
    });
    return;
  }

  if (err.name === 'ForbiddenError' || statusCode === 403) {
    res.status(403).json({
      message: 'Forbidden',
    });
    return;
  }

  if (statusCode === 500) {
    res.status(500).json({
      message: 'Internal Server Error',
    });
    return;
  }

  res.status(statusCode).json({
    message: errorMessage,
  });
};