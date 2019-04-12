const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const models = require('../database/models');
const keys = require('../config/keys.json');
const app = require('../app');

describe('[controller] login.js', () => {
  describe('login', () => {
    test('It returns null if user doesnt exists', async () => {
      const response = await request(app).post({
        url: '/api/login',
        body: {
          email: 'jao@doe.com',
          password: '123123123',
        },
        json: true,
      });
      expect(response.status).toBe(400);
      expect(response.body.success).toBeFalsy();
      expect(response.body.msg).toStrictEqual('email invalid');
    });

    test('It returns error for invalid email', async () => {
      const response = await request(app).post({
        url: 'http://localhost:80/api/login',
        body: {
          email: 'john@@doe.com',
          password: '123123123',
        },
        json: true,
      });
      expect(response.status).toBe(400);
      expect(response.body.success).toBeFalsy();
      expect(response.body.error).not.toBeNull();
    });

    test('It returns error for invalid password', async () => {
      const user = new models.User({ email: 'john@doe.com', name: 'John', password: await bcrypt.hash('1231231231', 10) });
      await user.save();

      const response = await request(app).post({
        url: '/api/login',
        body: {
          email: 'john@doe.com',
          password: '123456789',
        },
        json: true,
      });
      expect(response.status).toBe(400);
      expect(response.body.success).toBeFalsy();
      expect(response.body.msg).toStrictEqual('invalid password');
    });

    test('It returns user name if user exists', async () => {
      const user = new models.User({ email: 'john@doe.com', name: 'John', password: await bcrypt.hash('1231231231', 10) });
      await user.save();

      const response = await request(app).post({
        url: '/api/login',
        body: {
          email: 'john@doe.com',
          password: '1231231231',
        },
        json: true,
      });
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
      expect(response.body.token).toStrictEqual(await jwt.token('john@doe.com', keys));
    });
  });
});
