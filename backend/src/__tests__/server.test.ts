import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { createServer } from '../server.js';

describe('Server API Tests', () => {
  let app: any;

  beforeEach(async () => {
    app = await createServer();
  });

  describe('GET /ping', () => {
    it('should return pong', async () => {
      const response = await request(app).get('/ping');
      expect(response.status).toBe(200);
      expect(response.text).toBe('pong');
    });
  });
});
