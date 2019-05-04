const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../../database/models');
const app = require('../../app');
const keys = require('../../utils/keys.json');


describe('[DOMAIN/AUTHENTICATION] login.js', () => {
  describe('login', () => {
    test('It returns error if user doesnt exists', async () => {
      const response = await request(app)
        .post('/api/authentication/login')
        .send({
          email: 'otavio@ogoes.dev',
          password: '12345678',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toStrictEqual('user doesnt exist');
      expect(response.body.data).toBeNull();
    });

    test('It returns error for invalid email', async () => {
      const response = await request(app)
        .post('/api/authentication/login')
        .send({
          email: 'otavio-ogoes',
          password: '123456',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toStrictEqual('validation fail');
      expect(response.body.data).toBeNull();
    });

    test('It returns error for invalid password', async () => {
      const user = await new models.User({
        email: 'otavio@ogoes.de',
        name: 'Gord',
        password: await bcrypt.hash('12345678', 10),
      });
      await user.save();

      const response = await request(app)
        .post('/api/authentication/login')
        .send({
          email: 'otavio@ogoes.de',
          password: '12345671',
        });

      expect(response.status).toBe(400);
      expect(response.body.data).toBeNull();
      expect(response.body.message).toStrictEqual('invalid password');
    });

    test('It returns user name if user exists and password is valid', async () => {
      const user = await new models.User({
        email: 'otavio@ogoes.dev',
        name: 'Gord',
        password: await bcrypt.hash('12345678', 10),
      });
      await user.save();

      const response = await request(app)
        .post('/api/authentication/login')
        .send({
          email: 'otavio@ogoes.dev',
          password: '12345678',
        });

      const token = await jwt.sign('otavio@ogoes.dev', keys.jwt);
      expect(response.status).toBe(200);
      expect(response.body.message).toStrictEqual('sucess');
      expect(response.body.data.name).toStrictEqual(user.name);
      expect(response.body.data.token).toStrictEqual(token);
    });
  });
});
