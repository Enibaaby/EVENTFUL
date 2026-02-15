import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../dtos/auth.dto';
import { sendResponse } from '../utils/response.util';

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return sendResponse(res, 400, false, error.details[0].message);
    }

    // 2. Process registration
    const { user, token } = await authService.registerUser(value);

    // 3. Remove password from output
    user.password = undefined;

    sendResponse(res, 201, true, 'User registered successfully', { user, token });
  } catch (error) {
    next(error); // Passes to global error handler
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return sendResponse(res, 400, false, error.details[0].message);
    }

    const { user, token } = await authService.loginUser(value.email, value.password);
    
    user.password = undefined;

    sendResponse(res, 200, true, 'User logged in successfully', { user, token });
  } catch (error) {
    next(error);
  }
};