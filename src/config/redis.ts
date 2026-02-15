import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || '';
let redisClient: any;

// If a real cloud URL is provided (not localhost), try to connect
if (redisUrl && !redisUrl.includes('localhost')) {
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 1, // Stop retrying endlessly if it fails
  });

  redisClient.on('connect', () => {
    console.log('Redis Cache Connected successfully');
  });

  redisClient.on('error', (err: any) => {
    console.error('Redis connection error:', err.message);
  });
} else {
  // Mock client for local development to prevent connection errors
  console.log('⚠️ Redis skipped for local development (using mock client).');
  
  redisClient = {
    get: async () => null, // Always triggers a "cache miss", routing to MongoDB
    set: async () => null,
    del: async () => null,
    on: () => null
  };
}

export default redisClient;