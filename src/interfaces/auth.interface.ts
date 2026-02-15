import { Request } from 'express';
import { IUser } from '../models/User.model';

// Extends the default Express Request to include our custom authenticated user
export interface AuthRequest extends Request {
  user?: IUser;
}