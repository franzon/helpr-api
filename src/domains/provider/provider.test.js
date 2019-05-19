const request = require('supertest');
const models = require('../../database/models');
const app = require('../../app');

describe('addProvider', () => {
  test('It should response success for POST method', async () => {
    const res = await request(app).post('/api/provider/').send(
      {
        email: 'dennis@dennis.com',
        name: 'Dennis',
        password: '12345678',
        cep: '87302-050',
        address: 'Rua das Palmeiras',
        neighborhood: 'Larpão',
        numberAddress: '27',
        phoneNumber: '(44)99999-1234',
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
      password: '12345678',
      cep: '87302-050 ',
      address: 'Rua das Palmeiras',
      neighborhood: 'Larpão',
      numberAddress: '27',
      phoneNumber: '(44)29133-1213',
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
    const res = await request(app).post('/api/provider').send(
      {
        email: 'dennis',
        name: 'Dennis',
        password: '12345678',
        cep: '87302-050',
        address: 'Rua das Palmeiras',
        neighborhood: 'Larpão',
        numberAddress: '27',
        phoneNumber: '(44) 29999-1213',
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
      email: 'joe@joe.joe',
      name: 'Dennis',
      password: '12345678',
      cep: '87302-050 ',
      address: 'Rua das Palmeiras',
      neighborhood: 'Larpão',
      numberAddress: '27',
      phoneNumber: '(44)29133-1213',
      cpf: '240.309.190-14',
    });

    await provider.save();

    const res = await request(app).get('/api/provider/findProvider/joe@joe.joe');

    expect(res.status).toBe(200);
    expect(res.body.message).toStrictEqual('success');
    expect(res.body.data).not.toBeNull();
  });

  test('It should response error for GET method when user not found', async () => {
    const res = await request(app).get('/api/provider/findProvider/joe@joe.joe');

    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('user not found');
    expect(res.body.data).toBeNull();
  });

  test('It should response error for invalid email', async () => {
    const res = await request(app).get('/api/provider/findProvider/abc');

    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('fail validation');
    expect(res.body.data).toBeNull();
  });
});

describe('deleteProvider', () => {
  test('It should response success for DELETE method', async () => {
    const provider = new models.Provider({
      email: 'joe@joe',
      name: 'Dennis',
      password: '12345678',
      cep: '87302-050 ',
      address: 'Rua das Palmeiras',
      neighborhood: 'Larpão',
      numberAddress: '27',
      phoneNumber: '(44)29133-1213',
      cpf: '240.309.190-14',
    });

    await provider.save();

    const res = await request(app).delete('/api/provider/joe@joe');

    expect(res.status).toBe(200);
    expect(res.body.message).toStrictEqual('success');
    expect(res.body.data).toBeNull();
  });

  test('It should response error for DELETE method', async () => {
    const res = await request(app).delete('/api/provider/joe@joe');

    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('fail');
    expect(res.body.data).toBeNull();
  });

  test('It should response error for invalid email', async () => {
    const res = await request(app).delete('/api/provider/abc');

    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('fail validation');
    expect(res.body.data).toBeNull();
  });
});

describe('addCategory for provider', () => {
  test('It should response error for user not found', async () => {
    const category = new models.CategoriesProvider({
      identifier: 'Builder',
      title: 'Pedreiro',
    });

    await category.save();

    const res = await request(app).post('/api/provider/category').send(
      {
        email: 'carlos@sumare.com',
        activities: [
          {
            category: 'Pedreiro',
            title: 'Azulejista',
            description: 'Arrumo azulejo',
            price: '12345',
          },
        ],
      },
    );

    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('provider not found');
  });

  test('It should response success for add category to provider', async () => {
    const provider = new models.Provider({
      email: 'carlos@sumare.com',
      name: 'Carlos Sumare',
      password: '12345678',
      cep: '87302-050 ',
      address: 'Rua das Palmeiras',
      neighborhood: 'Larpão',
      numberAddress: '27',
      phoneNumber: '(44)29133-1213',
      cpf: '240.309.190-14',
    });

    const category = new models.CategoriesProvider({
      identifier: 'Builder',
      title: 'Pedreiro',
    });

    await provider.save();
    await category.save();

    const res = await request(app).post('/api/provider/category').send(
      {
        email: 'carlos@sumare.com',
        activities: [
          {
            category: 'Pedreiro',
            title: 'Azulejista',
            description: 'Arrumo azulejo',
            price: '12345',
          },
        ],
      },
    );

    expect(res.status).toBe(200);
    expect(res.body.message).toStrictEqual('success');
  });

  test('It shoulds response error for incorrect email', async () => {
    const provider = new models.Provider({
      email: 'carlos@sumare.com',
      name: 'Carlos Sumare',
      password: '12345678',
      cep: '87302-050 ',
      address: 'Rua das Palmeiras',
      neighborhood: 'Larpão',
      numberAddress: '27',
      phoneNumber: '(44)29133-1213',
      cpf: '240.309.190-14',
    });

    const category = new models.CategoriesProvider({
      identifier: 'Builder',
      title: 'Pedreiro',
    });

    await provider.save();
    await category.save();

    const res = await request(app).post('/api/provider/category').send(
      {
        email: 'abc',
        activities: [
          {
            category: 'Pedreiro',
            title: 'Azulejista',
            description: 'Arrumo azulejo',
            price: '12345',
          },
        ],
      },
    );

    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('fail validation');
  });

  test('No category duplication in provider', async () => {
    let provider = new models.Provider({
      email: 'carlos@sumare.com',
      name: 'Carlos Sumare',
      password: '12345678',
      cep: '87302-050 ',
      address: 'Rua das Palmeiras',
      neighborhood: 'Larpão',
      numberAddress: '27',
      phoneNumber: '(44)29133-1213',
      cpf: '240.309.190-14',
    });

    const category = new models.CategoriesProvider({
      identifier: 'Builder',
      title: 'Pedreiro',
    });

    await provider.save();
    await category.save();

    await request(app).post('/api/provider/category').send(
      {
        email: 'carlos@sumare.com',
        activities: [
          {
            category: 'Pedreiro',
            title: 'Azulejista',
            description: 'Arrumo azulejo',
            price: '12345',
          },
          {
            category: 'Pedreiro',
            title: 'Bater laje',
            description: 'Bato laje com qualidade',
            price: '777',
          },
        ],
      },
    );
    provider = await models.Provider.findOne({ email: 'carlos@sumare.com' });
    expect(provider.categories).toHaveLength(1);
  });
});
