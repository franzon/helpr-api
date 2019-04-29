const request = require('supertest');
const models = require('../../database/models');
const app = require('../../app');

describe('domains/authentication/user.js', () => {
  describe('getUserNameByEmail', () => {
    test('It returns null for data if user not exists', async () => {
      const response = await request(app).get(
        '/api/user/getUserNameByEmail/john@doe.com',
      );
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('user not exists');
      expect(response.body.data).toBeNull();
    });

    test('It returns error for invalid email', async () => {
      const response = await request(app).get(
        '/api/user/getUserNameByEmail/john@@doe.com',
      );
      expect(response.status).toBe(400);
      expect(response.body.message).not.toBeNull();
      expect(response.body.data).toBeNull();
    });

    test('It returns user name if user exists', async () => {
      const user = new models.User({ email: 'john@doe.com', name: 'John' });
      await user.save();

      const response = await request(app).get('/api/user/getUserNameByEmail/john@doe.com');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('user exists');
      expect(response.body.data).toStrictEqual('John');
    });
  });
});
