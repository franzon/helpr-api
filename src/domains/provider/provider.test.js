const request = require('supertest');
const models = require('../../database/models');
const app = require('../../app');

describe('addProvider', () => {
  test('It should response success for POST method', async () => {
    const res = await request(app).post('/api/provider/').send(
      {
        email: 'dennis@dennis.com',
        name: 'Dennis',
        password: '123456',
        cep: '87302-050',
        numberAddress: '27',
        phoneNumber: '(44) 99999-1213',
        category: 'Bricklayer',
        serviceDescription: 'Bricklayer services',
        servicePrice: '100 - 1000',
        cpf: '240.309.190-14',
      },
    );

    expect(res.status).toBe(200);
    expect(res.body.message).toStrictEqual('success');
    expect(res.body.data).not.toBeNull();
  });
  test('It return error for POST method if already used email', async () => {
    const provider = {
      email: 'dennis@dennis',
      name: 'Dennis',
      password: '123456',
      cep: '87302-050 ',
      numberAddress: '27',
      phoneNumber: '(44)29133-1213',
      category: 'Bricklayer',
      serviceDescription: 'Bricklayer services',
      servicePrice: '100 - 1000',
      cpf: '240.309.190-14',
    };

    const resProvider = await models.Provider.create(provider);
    expect(resProvider).not.toBeNull();

    const res = await request(app).post('/api/provider/').send(provider);
    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('email already used');
    expect(res.body.data).toBeNull();
  });
  test('It return error for invalid data', async () => {
    const res = await request(app).post('api/provider').send(
      {
        email: 'dennis',
        name: 'Dennis',
        password: '123456',
        cep: '87302-050',
        numberAddress: '27',
        phoneNumber: '(44) 29999-1213',
        category: 'Bricklayer',
        serviceDescription: 'Bricklayer services',
        servicePrice: '100 - 1000',
        cpf: '240309190-14',
      },
    );
    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('fail validation');
    expect(res.body.data).toBeNull();
  });
});

describe('findProvider', () => {
  test('It should response success for GET method', async () => {
    const provider = new models.Provider({
      email: 'joe@joe',
      name: 'Dennis',
      password: '123456',
      cep: '87302-050 ',
      numberAddress: '27',
      phoneNumber: '(44)29133-1213',
      category: 'Bricklayer',
      serviceDescription: 'Bricklayer services',
      servicePrice: '100 - 1000',
      cpf: '240.309.190-14',
    });

    await provider.save();

    const res = await request(app).get('api/provider/getProvider:joe@joe');

    expect(res.status).toBe(200);
    expect(res.body.message).toStrictEqual('succes');
    expect(res.body.data).not.toBeNull();
  });

  test('It should response error for GET method when user not found', async () => {
    const res = await request(app).get('api/provider/getProvider:joe@joe');

    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('user not found');
    expect(res.body.data).not.toBeNull();
  });
});

describe('deleteProvider', () => {
  test('It should response success for DELETE method', async () => {
    const provider = new models.Provider({
      email: 'joe@joe',
      name: 'Dennis',
      password: '123456',
      cep: '87302-050 ',
      numberAddress: '27',
      phoneNumber: '(44)29133-1213',
      category: 'Bricklayer',
      serviceDescription: 'Bricklayer services',
      servicePrice: '100 - 1000',
      cpf: '240.309.190-14',
    });

    await provider.save();

    const res = await request(app).delete('api/provider/:joe@joe');

    expect(res.status).toBe(200);
    expect(res.message).toStrictEqual('success');
    expect(res.data).not.toBeNull();
  });

  test('It should response error for DELETE method', async () => {
    const res = await request(app).delete('api/provider/:joe@joe');

    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('user not exists');
    expect(res.body.data).toBeNull();
  });
});
