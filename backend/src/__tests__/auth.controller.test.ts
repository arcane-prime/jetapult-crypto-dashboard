import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import { createServer } from '../server.js';

// Mock the cache module to prevent Redis connection attempts
jest.mock('../cache/redis-client.js', () => ({
  getCachedData: jest.fn<() => Promise<any>>().mockResolvedValue(null),
  setCachedData: jest.fn<() => Promise<any>>().mockResolvedValue(undefined),
  getCacheKeyTopNCryptos: jest.fn((n: number) => `cryptoCurrencies_n_${n}`),
  getCacheKeyCryptoIds: jest.fn(() => 'cryptoIds'),
  getCacheKeyCryptoHistoricData: jest.fn((id: string) => `cryptoHistoricData_${id}`),
  getCacheKeySearchQuery: jest.fn((query: string) => `searchQuery_${query.toLowerCase()}`),
  isRedisAvailable: jest.fn(() => false),
}));

// Mock the repository to prevent database connections
jest.mock('../repositories/auth.repository.js', () => ({
  getUserById: jest.fn<() => Promise<any>>().mockResolvedValue(null),
  addFavoriteCrypto: jest.fn<() => Promise<any[]>>().mockResolvedValue([]),
  removeFavoriteCrypto: jest.fn<() => Promise<any[]>>().mockResolvedValue([]),
}));

describe('Auth API Tests', () => {
  let app: any;

  beforeEach(async () => {
    app = await createServer();
  });

  describe('GET /auth/me', () => {
    it('should return 401 when no token is provided', async () => {
      const response = await request(app).get('/auth/me');

      expect(response.status).toBe(401);
    });

    it('should return 401 when invalid token is provided', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    it('should return 401 when token format is incorrect', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'InvalidFormat token');

      expect(response.status).toBe(401);
    });
  });
});
