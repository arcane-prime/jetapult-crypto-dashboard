import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import { createServer } from '../server.js';

// Mock the cache module to prevent Redis connection attempts
jest.mock('../cache/redis-client.js', () => ({
  getCachedData: jest.fn().mockResolvedValue(null),
  setCachedData: jest.fn().mockResolvedValue(undefined),
  getCacheKeyTopNCryptos: jest.fn((n: number) => `cryptoCurrencies_n_${n}`),
  getCacheKeyCryptoIds: jest.fn(() => 'cryptoIds'),
  getCacheKeyCryptoHistoricData: jest.fn((id: string) => `cryptoHistoricData_${id}`),
  getCacheKeySearchQuery: jest.fn((query: string) => `searchQuery_${query.toLowerCase()}`),
  isRedisAvailable: jest.fn(() => false),
}));

// Mock the repository to prevent database connections
jest.mock('../repositories/crypto.repository.js', () => ({
  getTopNCryptos: jest.fn().mockResolvedValue([]),
  getCryptoIds: jest.fn().mockResolvedValue([]),
  getCryptoHistoricData: jest.fn().mockResolvedValue(null),
  getCryptoIdFromName: jest.fn().mockResolvedValue(null),
}));

describe('Crypto API Tests', () => {
  let app: any;

  beforeEach(async () => {
    app = await createServer();
  });

  describe('GET /crypto/top', () => {
    it('should return 400 when topN is greater than 10', async () => {
      const response = await request(app).get('/crypto/top?topN=15');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('between 1 and 10');
    });

    it('should return 400 when topN is negative', async () => {
      const response = await request(app).get('/crypto/top?topN=-5');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
