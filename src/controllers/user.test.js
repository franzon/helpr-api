const request = require('supertest');
const models = require('../database/models');
const app = require('../app');

describe('[controller] user.js', () => {
  describe('createUser', () => {
    test('It returns true in success for create user', async () => {
      const user = {
        name: 'everton',
        email: 'everton@jrabreu.com',
        phone: '44988287383',
        password: '12345678',
      };

      const response = await request(app)
        .post('/api/user/add')
        .send(user);
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
      expect(response.body.data).not.toBeNull();
    });

    test('It return false in success if already used email', async () => {
      const user = {
        name: 'everton',
        email: 'everton@jrabreu.com',
        phone: '44988287383',
        password: '12345678',
      };

      const newUser = await models.User(user);
      await newUser.save();
      const response2 = await request(app)
        .post('/api/user/add')
        .send(user);

      const users = await models.User.find({});
      console.log('ss', users);
      expect(response2.status).toBe(400);
      expect(response2.body.success).toBeFalsy();
      expect(response2.body.data).toBeNull();
    });
  });
});
