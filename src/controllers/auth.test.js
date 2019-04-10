const request = require('supertest');
const models = require('../database/models');
const app = require('../app');

describe('[controller] auth.js', () => {
  describe('getUser', () => {
    test('It returns null for data if user doesnt exists', async () => {
      const response = await request(app).get('/api/auth/get-user/john@doe.com');
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
      expect(response.body.data).toBeNull();
    });

    test('It returns error for invalid email', async () => {
      const response = await request(app).get('/api/auth/get-user/john@@doe.com');
      expect(response.status).toBe(400);
      expect(response.body.success).toBeFalsy();
      expect(response.body.error).not.toBeNull();
    });

    test('It returns user name if user exists', async () => {
      const user = new models.User({ email: 'john@doe.com', name: 'John' });
      await user.save();

      const response = await request(app).get('/api/auth/get-user/john@doe.com');
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();

      expect(response.body.data).toStrictEqual({ name: 'John' });
    });
  });

  describe('sendConfirmationCode', () => {});

  describe('confirmEmail', () => {});
});
