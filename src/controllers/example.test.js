const request = require('supertest');
const app = require('../app');

describe('[controller] example.js', () => {
  describe('GET /', () => {
    test('It returns {success: true}', async () => {
      const response = await request(app).get('/api/example');
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
    });
  });
  describe('GET /:id', () => {
    test('It returns {success: true}', async () => {
      const response = await request(app).get('/api/example/5');
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
    });

    test('It returns {success: false} if id is invalid', async () => {
      const response = await request(app).get('/api/example/hey');
      expect(response.status).toBe(200);
      expect(response.body.success).toBeFalsy();
    });
  });
  describe('POST /', () => {
    test('It returns {success: true}', async () => {
      const response = await request(app)
        .post('/api/example')
        .send({ name: 'Jorge' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
    });

    test('It returns {success: false} if the body is invalid', async () => {
      const response = await request(app)
        .post('/api/example')
        .send({ namee: 'Jorge' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBeFalsy();
    });
  });
  describe('PUT /:id', () => {
    test('It returns {success: true}', async () => {
      const response = await request(app)
        .put('/api/example/5')
        .send({ name: 'Jorge' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
    });

    test('It returns {success: false} if the body is invalid', async () => {
      const response = await request(app)
        .put('/api/example/5')
        .send({ namee: 'Jorge' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBeFalsy();
    });

    test('It returns {success: false} if params are invalid', async () => {
      const response = await request(app)
        .put('/api/example/hey')
        .send({ name: 'Jorge' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBeFalsy();
    });

    test('It returns {success: false} if both params and body are invalid', async () => {
      const response = await request(app)
        .put('/api/example/hey')
        .send({ namee: 'Jorge' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBeFalsy();
    });
  });
  describe('DELETE /:id', () => {
    test('It returns {success: true}', async () => {
      const response = await request(app).delete('/api/example/5');
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
    });

    test('It returns {success: false} if id is invalid', async () => {
      const response = await request(app).delete('/api/example/hey');
      expect(response.status).toBe(200);
      expect(response.body.success).toBeFalsy();
    });
  });
});
