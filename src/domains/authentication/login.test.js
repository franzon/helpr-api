const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../../database/models');
const app = require('../../app');
const keys = require('../../utils/keys.json');

describe('[DOMAIN/AUTHENTICATION] login.js', () => {
  describe('login', () => {
    test('It returns error for wrong parameter', async () => {
      const response = await request(app)
        .post('/api/authentication/login/house')
        .send({
          email: 'otavio@ogoes.dev',
          password: '12345678',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toStrictEqual('wrong parameter');
      expect(response.body.data).toBeNull();
    });

    test('It returns error if user/provider doesnt exists', async () => {
      const response = await request(app)
        .post('/api/authentication/login/user')
        .send({
          email: 'otavio@ogoes.dev',
          password: '12345678',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toStrictEqual('user/provider doesnt exists');
      expect(response.body.data).toBeNull();
    });

    test('It returns error for invalid email', async () => {
      const response = await request(app)
        .post('/api/authentication/login/user')
        .send({
          email: 'otavio-ogoes',
          password: '123456',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).not.toBeUndefined();
      expect(response.body.data).toBeNull();
    });

    test('It returns error for invalid user password', async () => {
      const user = await new models.User({
        email: 'otavio@ogoes.de',
        name: 'Gord',
        password: await bcrypt.hash('12345678', 10),
      });
      await user.save();

      const response = await request(app)
        .post('/api/authentication/login/user')
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
        .post('/api/authentication/login/user')
        .send({
          email: 'otavio@ogoes.dev',
          password: '12345678',
        });

      const token = await jwt.sign('otavio@ogoes.dev', keys.jwt);
      expect(response.status).toBe(200);
      expect(response.body.message).toStrictEqual('success');
      expect(response.body.data.name).toStrictEqual(user.name);
      expect(response.body.data.token).toStrictEqual(token);
    });
    test('It returns provider name if provider exists and password is valid', async () => {
      const provider = await new models.Provider({
        email: 'otavio@ogoes.dev',
        name: 'Gord',
        password: await bcrypt.hash('12345678', 10),
        cep: '44910000',
        address: 'Rua São Sebastião',
        neighborhood: 'Centro',
        numberAddress: '378',
        phoneNumber: '44991357268',
        category: 'asdasdasd',
        serviceDescription: 'Asdasdasd',
        servicePrice: '1000',
        cpf: '068.756.945-14',
        documentImageAddress: 'asdasdas',
      });
      await provider.save();

      const response = await request(app)
        .post('/api/authentication/login/provider')
        .send({
          email: 'otavio@ogoes.dev',
          password: '12345678',
        });

      const token = await jwt.sign('otavio@ogoes.dev', keys.jwt);
      expect(response.status).toBe(200);
      expect(response.body.message).toStrictEqual('success');
      expect(response.body.data.name).toStrictEqual(provider.name);
      expect(response.body.data.token).toStrictEqual(token);
    });
  });
});
