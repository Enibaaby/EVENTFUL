import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { User } from '../src/models/User.model';

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    // Connect to a local test database
    await mongoose.connect('mongodb://localhost:27017/eventful-test-db');
  });

  afterAll(async () => {
    // Clean up database and close connection after tests run
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new eventee successfully', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Test User',
        email: 'test@eventful.com',
        password: 'password123',
        role: 'eventee',
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('test@eventful.com');
    });

    it('should reject registration with invalid email', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Test User',
        email: 'not-an-email',
        password: 'password123',
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });
  });
});