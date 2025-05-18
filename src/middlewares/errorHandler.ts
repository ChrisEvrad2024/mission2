import { Request, Response, NextFunction } from 'express';

export class ErrorHandler extends Error {
  statusCode: number;
  details?: any;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const handleError = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode = 500, message, details } = err;

  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(details && { details })
  });
};
