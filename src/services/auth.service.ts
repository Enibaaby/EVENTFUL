import { User, IUser } from '../models/User.model';
import jwt from 'jsonwebtoken';

export class AuthService {
  private generateToken(id: string): string {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
  }

  public async registerUser(data: Partial<IUser>): Promise<{ user: IUser; token: string }> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw { statusCode: 400, message: 'User with this email already exists' };
    }

    const user = await User.create(data);
    const token = this.generateToken(user.id);

    return { user, token };
  }

  public async loginUser(email: string, password: string): Promise<{ user: IUser; token: string }> {
    // Select password because it's hidden by default in the model
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const token = this.generateToken(user.id);
    return { user, token };
  }
}