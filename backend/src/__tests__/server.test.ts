import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { startServer } from '../server.js';

describe('Server API Tests', () => {
  let app: any;

  beforeEach(async () => {
    app = await startServer();
  });

  describe('GET /ping', () => {
    it('should return pong', async () => {
      const response = await request(app).get('/ping');
      expect(response.status).toBe(200);
      expect(response.text).toBe('pong');
    });
  });
});
