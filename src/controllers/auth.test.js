const request = require('supertest');
const models = require('../database/models');
const app = require('../app');

describe('[controller] auth.js', () => {
  describe('getUser', () => {
    test('It returns null for data if user doesnt exists', async () => {
      const response = await request(app).get('/api/auth/get-user/+5544999998888');
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
      expect(response.body.data).toBeNull();
    });

    test('It returns error for invalid phone number', async () => {
      const response = await request(app).get('/api/auth/get-user/1234');
      expect(response.status).toBe(400);
      expect(response.body.success).toBeFalsy();
      expect(response.body.error).not.toBeNull();
    });

    test('It returns user name if user exists', async () => {
      const user = new models.User({ phone: '+5544999998888', name: 'John' });
      await user.save();

      const response = await request(app).get('/api/auth/get-user/+5544999998888');
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();

      expect(response.body.data).toStrictEqual({ name: 'John' });
    });
  });
});
