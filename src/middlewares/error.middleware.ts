import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/response.util';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${message}`);

  sendResponse(res, statusCode, false, message, err.stack);
};