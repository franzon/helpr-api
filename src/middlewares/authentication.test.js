const request = require('supertest');
const jwt = require('jsonwebtoken');
const models = require('../database/models');
const app = require('../app');
const keys = require('../utils/keys.json');

describe('middlewares/authentication', () => {
  it('Returns error if doesnt pass token in headers', async () => {
    const response = await request(app)
      .get('/api/user/getUserInfo')
      .set('tokenz', '');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('invalid token');
    expect(response.body.data).toBeNull();
  });

  it('Returns error if token is invalid', async () => {
    const response = await request(app)
      .get('/api/user/getUserInfo')
      .set('token', 'invalid');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('invalid token');
    expect(response.body.data).toBeNull();
  });

  it('Returns error if token is valid but user doesnt exists', async () => {
    const token = await jwt.sign('a@a.com', keys.jwt);

    const response = await request(app)
      .get('/api/user/getUserInfo')
      .set('token', token);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('invalid token');
    expect(response.body.data).toBeNull();
  });

  it('Returns user info if token is correct', async () => {
    const user = await new models.User({
      email: 'a@a.com',
      name: 'Carlos Sumare',
      password: '1234',
    }).save();

    const token = await jwt.sign('a@a.com', keys.jwt);

    const response = await request(app)
      .get('/api/user/getUserInfo')
      .set('token', token);
    expect(response.status).toBe(200);
    expect(response.body.data).not.toBeNull();
  });
});
