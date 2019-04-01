const request = require('supertest');
const models = require('../database/models');
const app = require('../app');

describe('[controller] emailConfirmation.js', () => {
  describe('sendConfirmationCode', () => {
    test('It returns error for invalid email', async () => {
      const response = await request(app).get('/api/validation/john@@doe.com');
      expect(response.status).toBe(400);
      expect(response.body.success).toBeFalsy();
      expect(response.body.error).not.toBeNull();
    });

    test('It returns sucess and email', async () => {
      const response = await request(app).get('/api/validation/john@doe.com');
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
      expect(response.body.data.email).not.toBeNull();
    });
  });

  describe('confirmEmail', () => {
    test('It returns error for invalid email', async () => {
      const response = await request(app).get('/api/validation/john@@doe.com');
      expect(response.status).toBe(400);
      expect(response.body.success).toBeFalsy();
      expect(response.body.error).not.toBeNull();
    });
  });
});
