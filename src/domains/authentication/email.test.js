const request = require('supertest');
const models = require('../../database/models');
const app = require('../../app');

describe('domains/authentication/email.js', () => {
  describe('sendConfirmationCode', () => {
    test('It returns error for invalid email', async () => {
      const response = await request(app)
        .post('/api/authentication/email/sendConfirmationCode')
        .send({ email: 'john@@doe.com' });
      expect(response.status).toBe(400);
      expect(response.body.message).not.toBeNull();
      expect(response.body.data).toBeNull();
    });

    test('It returns error if user does not exists', async () => {
      const response = await request(app)
        .post('/api/authentication/email/sendConfirmationCode')
        .send({ email: 'john@doe.com' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('user not exists');
      expect(response.body.data).toBeNull();
    });

    test('It returns error if user its already confirmed', async () => {
      const user = new models.User({ email: 'john@doe.com', name: 'John', isConfirmed: true });
      await user.save();

      const response = await request(app)
        .post('/api/authentication/email/sendConfirmationCode')
        .send({ email: 'john@doe.com' });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('already confirmed');
      expect(response.body.data).toBeNull();
    });

    test('It sends a new verification email', async () => {
      const sendMailMock = jest.fn();
      jest.mock('nodemailer');
      // eslint-disable-next-line global-require
      const nodemailer = require('nodemailer');
      nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

      const user = new models.User({ email: 'john@doe.com', name: 'John' });
      await user.save();

      const response = await request(app)
        .post('/api/authentication/email/sendConfirmationCode')
        .send({ email: 'john@doe.com' });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('email sent');
      expect(response.body.data).toBeNull();

      const emailConfirmation = await models.EmailConfirmation.findOne({ email: 'john@doe.com' });
      expect(emailConfirmation.confirmationCode).not.toBeNull();
      expect(typeof emailConfirmation.confirmationCode).toBe('string');
      expect(sendMailMock).toHaveBeenCalled();

      sendMailMock.mockClear();
      nodemailer.createTransport.mockClear();
    });

    test('It resends a new verification email', async () => {
      const sendMailMock = jest.fn();
      jest.mock('nodemailer');
      // eslint-disable-next-line global-require
      const nodemailer = require('nodemailer');
      nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

      const user = new models.User({ email: 'john@doe.com', name: 'John' });
      await user.save();

      let emailConfirmation = new models.EmailConfirmation({
        email: 'john@doe.com',
        confirmationCode: '777',
      });
      await emailConfirmation.save();

      expect(emailConfirmation.confirmationCode).toBe('777');
      const response = await request(app)
        .post('/api/authentication/email/sendConfirmationCode')
        .send({ email: 'john@doe.com' });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('email sent');
      expect(response.body.data).toBeNull();

      emailConfirmation = await models.EmailConfirmation.findOne({ email: 'john@doe.com' });
      expect(emailConfirmation.confirmationCode).not.toBeNull();
      expect(emailConfirmation.confirmationCode).not.toBe('777');
      expect(sendMailMock).toHaveBeenCalled();

      sendMailMock.mockClear();
      nodemailer.createTransport.mockClear();
    });
  });

  describe('confirmEmail', () => {
    test('It returns error for invalid email', async () => {
      const response = await request(app)
        .post('/api/authentication/email/confirmEmail')
        .send({ email: 'john@@doe.com', confirmationCode: '777' });
      expect(response.status).toBe(400);
      expect(response.body.message).not.toBeNull();
      expect(response.body.data).toBeNull();
    });

    test('It returns error for invalid confirmation code', async () => {
      const response = await request(app)
        .post('/api/authentication/email/confirmEmail')
        .send({ email: 'john@doe.com', confirmationCode: null });
      expect(response.status).toBe(400);
      expect(response.body.message).not.toBeNull();
      expect(response.body.data).toBeNull();
    });

    test('It returns error if user does not exists', async () => {
      const response = await request(app)
        .post('/api/authentication/email/confirmEmail')
        .send({ email: 'john@doe.com', confirmationCode: '777' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('user not exists');
      expect(response.body.data).toBeNull();
    });

    test('It returns error if user its already confirmed', async () => {
      const user = new models.User({ email: 'john@doe.com', name: 'John', isConfirmed: true });
      await user.save();

      const response = await request(app)
        .post('/api/authentication/email/confirmEmail')
        .send({ email: 'john@doe.com', confirmationCode: '777' });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('already confirmed');
      expect(response.body.data).toBeNull();
    });

    test('It returns error if code is invalid', async () => {
      let user = new models.User({ email: 'john@doe.com', name: 'John' });
      await user.save();

      let emailConfirmation = new models.EmailConfirmation({
        email: 'john@doe.com',
        confirmationCode: '777',
      });
      await emailConfirmation.save();

      expect(emailConfirmation.confirmationCode).toBe('777');

      const response = await request(app)
        .post('/api/authentication/email/confirmEmail')
        .send({ email: 'john@doe.com', confirmationCode: '778' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('invalid code');
      expect(response.body.data).toBeNull();

      user = await models.User.findOne({ email: 'john@doe.com' });
      expect(user.isConfirmed).toBeFalsy();

      emailConfirmation = await models.EmailConfirmation.findOne({
        email: 'john@doe.com',
        confirmationCode: '777',
      });
      expect(emailConfirmation).not.toBeNull();
    });

    test('It confirms user if code is valid', async () => {
      let user = new models.User({ email: 'john@doe.com', name: 'John' });
      await user.save();

      let emailConfirmation = new models.EmailConfirmation({
        email: 'john@doe.com',
        confirmationCode: '777',
      });
      await emailConfirmation.save();

      expect(emailConfirmation.confirmationCode).toBe('777');

      const response = await request(app)
        .post('/api/authentication/email/confirmEmail')
        .send({ email: 'john@doe.com', confirmationCode: '777' });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('email confirmed');

      user = await models.User.findOne({ email: 'john@doe.com' });
      expect(user.isConfirmed).toBeTruthy();
      expect(response.body.data).toBeNull();

      emailConfirmation = await models.EmailConfirmation.findOne({
        email: 'john@doe.com',
        confirmationCode: '777',
      });

      expect(emailConfirmation).toBeNull();
    });
  });
});
