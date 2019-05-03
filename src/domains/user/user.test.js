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
  describe('createUser', () => {
    test('It returns true in success for create user', async () => {
      const user = {
        name: 'everton',
        email: 'everton@jrabreu.com',
        phone: '44 9 8828-7383',
        password: '12345678',
      };

      const response = await request(app)
        .post('/api/user/createUser')
        .send(user);

      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
      expect(response.body.data).not.toBeNull();
    });

    test('It returns false in success for create user due incorrect parameters', async () => {
      const user = {
        name: 'everton',
        email: 'everton@jrabreu.com',
        phone: '449 8828-7383',
        password: '12345678',
      };

      const response = await request(app)
        .post('/api/user/createUser')
        .send(user);

      expect(response.status).toBe(400);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).not.toBeUndefined();
      expect(response.body.data).toBeNull();
    });

    test('It return false in success if already used email', async () => {
      const user = {
        name: 'everton',
        email: 'everton@jrabreu.com',
        phone: '44 9 8828-7383',
        password: '12345678',
      };
      const response1 = await request(app)
        .post('/api/user/createUser')
        .send(user);
      expect(response1.status).toBe(200);
      expect(response1.body.success).toBeTruthy();
      expect(response1.body.data).not.toBeNull();

      const response2 = await request(app)
        .post('/api/user/createUser')
        .send(user);

      expect(response2.status).toBe(400);
      expect(response2.body.success).toBeFalsy();
    });
  });
});
