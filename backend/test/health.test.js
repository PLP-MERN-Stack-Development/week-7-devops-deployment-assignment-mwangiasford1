const request = require('supertest');
const app = require('../index');

describe('Health Check Endpoint', () => {
  test('GET /health should return 200 and status OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
  });
});

describe('Root Endpoint', () => {
  test('GET / should return 200 and API message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('API is running');
  });
}); 