const request = require('supertest');
const app = require('../index');

describe('Health Check Endpoint', () => {
  test('GET /health should return 200 and status OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('memory');
    expect(response.body).toHaveProperty('cpu');
    expect(response.body).toHaveProperty('database');
  });
});

describe('Root Endpoint', () => {
  test('GET / should return 200 and API info', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('endpoints');
  });
});

describe('API Endpoints', () => {
  test('GET /api/auth should return 404 (no specific route)', async () => {
    const response = await request(app).get('/api/auth');
    expect(response.status).toBe(404);
  });

  test('GET /api/items should return items array', async () => {
    const response = await request(app).get('/api/items');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('items');
    expect(response.body).toHaveProperty('pagination');
  });
}); 