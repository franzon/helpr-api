/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const models = require('../../database/models');
const app = require('../../app');

describe('addService', () => {
  test('It should response success for POST method', async () => {
    const user = new models.User({
      name: 'everton',
      email: 'everton@jrabreu.com',
      password: '12345678',
    });

    await user.save();

    const client = await models.User.findOne({ email: 'everton@jrabreu.com' });

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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );

    await activity.save();

    const activityRequested = await models.ActivitiesProvider.findOne({ title: 'Azulejista' });

    const res = await request(app).post('/api/services').send(
      {
        client: client.id,
        provider: providerRequested.id,
        activity: activityRequested.id,
        description: 'description',
        value: 50,
      },
    );

    expect(res.body.message).toStrictEqual('success');
  });

  test('It should response 400 for invalid user in POST method', async () => {
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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );

    await activity.save();

    const activityRequested = await models.ActivitiesProvider.findOne({ title: 'Azulejista' });

    const res = await request(app).post('/api/services').send(
      {
        client: providerRequested.id,
        provider: providerRequested.id,
        activity: activityRequested.id,
        description: 'description',
        value: 50,
      },
    );

    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('Client not found');
  });

  test('It should response 400 for invalid provider in POST method', async () => {
    const user = new models.User({
      name: 'everton',
      email: 'everton@jrabreu.com',
      password: '12345678',
    });

    await user.save();

    const client = await models.User.findOne({ email: 'everton@jrabreu.com' });

    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );

    await activity.save();

    const activityRequested = await models.ActivitiesProvider.findOne({ title: 'Azulejista' });

    const res = await request(app).post('/api/services').send(
      {
        client: client.id,
        provider: client.id,
        activity: activityRequested.id,
        description: 'description',
        value: 50,
      },
    );

    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('Provider not found');
  });

  test('It should response 400 for invalid activity in POST method', async () => {
    const user = new models.User({
      name: 'everton',
      email: 'everton@jrabreu.com',
      password: '12345678',
    });

    await user.save();

    const client = await models.User.findOne({ email: 'everton@jrabreu.com' });

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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const res = await request(app).post('/api/services').send(
      {
        client: client.id,
        provider: providerRequested.id,
        activity: providerRequested.id,
        description: 'description',
        value: 50,
      },
    );

    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('Activity not found');
  });
});

describe('cancelService', () => {
  test('It should response success for POST method', async () => {
    const user = new models.User({
      name: 'everton',
      email: 'everton@jrabreu.com',
      password: '12345678',
    });

    await user.save();

    const client = await models.User.findOne({ email: 'everton@jrabreu.com' });

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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );

    await activity.save();

    const activityRequested = await models.ActivitiesProvider.findOne({ title: 'Azulejista' });

    const res = await request(app).post('/api/services').send(
      {
        client: client.id,
        provider: providerRequested.id,
        activity: activityRequested.id,
        description: 'description',
        value: 50,
      },
    );

    const response = await request(app).post('/api/services/cancel').send({
      service: res.body.data._id,
    });

    expect(response.body.message).toStrictEqual('success');
  });

  test('It should response Error for POST method', async () => {
    const user = new models.User({
      name: 'everton',
      email: 'everton@jrabreu.com',
      password: '12345678',
    });

    await user.save();

    const client = await models.User.findOne({ email: 'everton@jrabreu.com' });

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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );

    await activity.save();

    const activityRequested = await models.ActivitiesProvider.findOne({ title: 'Azulejista' });

    await request(app).post('/api/services').send(
      {
        client: client.id,
        provider: providerRequested.id,
        activity: activityRequested.id,
        description: 'description',
        value: 50,
      },
    );

    const res = await request(app).post('/api/services/cancel').send({
      service: client.id,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('Service not found');
  });
});

describe('acceptService', () => {
  test('It should response success for POST method', async () => {
    const user = new models.User({
      name: 'everton',
      email: 'everton@jrabreu.com',
      password: '12345678',
    });

    await user.save();

    const client = await models.User.findOne({ email: 'everton@jrabreu.com' });

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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );

    await activity.save();

    const activityRequested = await models.ActivitiesProvider.findOne({ title: 'Azulejista' });

    const res = await request(app).post('/api/services').send(
      {
        client: client.id,
        provider: providerRequested.id,
        activity: activityRequested.id,
        description: 'description',
        value: 50,
      },
    );

    const response = await request(app).post('/api/services/accept').send(
      {
        provider: providerRequested.id,
        service: res.body.data._id,
      },
    );

    expect(response.status).toBe(200);
  });
  test('It should response service already canceled for POST method', async () => {
    const user = new models.User({
      name: 'everton',
      email: 'everton@jrabreu.com',
      password: '12345678',
    });

    await user.save();

    const client = await models.User.findOne({ email: 'everton@jrabreu.com' });

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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );

    await activity.save();

    const activityRequested = await models.ActivitiesProvider.findOne({ title: 'Azulejista' });

    const res = await request(app).post('/api/services').send(
      {
        client: client.id,
        provider: providerRequested.id,
        activity: activityRequested.id,
        description: 'description',
        value: 50,
      },
    );

    await models.Service.updateMany({}, { status: 0 });

    const response = await request(app).post('/api/services/accept').send(
      {
        provider: providerRequested.id,
        service: res.body.data._id,
      },
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual('Service already canceled');
  });
  test('It should response service already denyed for POST method', async () => {
    const user = new models.User({
      name: 'everton',
      email: 'everton@jrabreu.com',
      password: '12345678',
    });

    await user.save();

    const client = await models.User.findOne({ email: 'everton@jrabreu.com' });

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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );

    await activity.save();

    const activityRequested = await models.ActivitiesProvider.findOne({ title: 'Azulejista' });

    const res = await request(app).post('/api/services').send(
      {
        client: client.id,
        provider: providerRequested.id,
        activity: activityRequested.id,
        description: 'description',
        value: 50,
      },
    );

    await models.Service.updateMany({}, { status: 3 });

    const response = await request(app).post('/api/services/accept').send(
      {
        provider: providerRequested.id,
        service: res.body.data._id,
      },
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toStrictEqual('Service already denyed');
  });
  test('It should response service already accepted for POST method', async () => {
    const user = new models.User({
      name: 'everton',
      email: 'everton@jrabreu.com',
      password: '12345678',
    });

    await user.save();

    const client = await models.User.findOne({ email: 'everton@jrabreu.com' });

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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );

    await activity.save();

    const activityRequested = await models.ActivitiesProvider.findOne({ title: 'Azulejista' });

    const res = await request(app).post('/api/services').send(
      {
        client: client.id,
        provider: providerRequested.id,
        activity: activityRequested.id,
        description: 'description',
        value: 50,
      },
    );

    await models.Service.updateMany({}, { status: 2 });

    const response = await request(app).post('/api/services/accept').send(
      {
        provider: providerRequested.id,
        service: res.body.data._id,
      },
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toStrictEqual('Service already accepted');
  });
  test('It should response service not found for POST method', async () => {
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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const response = await request(app).post('/api/services/accept').send(
      {
        provider: providerRequested.id,
        service: providerRequested.id,
      },
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual('Service not found');
  });
});

describe('denyService', () => {
  test('It should response success for POST method', async () => {
    const user = new models.User({
      name: 'everton',
      email: 'everton@jrabreu.com',
      password: '12345678',
    });

    await user.save();

    const client = await models.User.findOne({ email: 'everton@jrabreu.com' });

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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );

    await activity.save();

    const activityRequested = await models.ActivitiesProvider.findOne({ title: 'Azulejista' });

    const res = await request(app).post('/api/services').send(
      {
        client: client.id,
        provider: providerRequested.id,
        activity: activityRequested.id,
        description: 'description',
        value: 50,
      },
    );

    const response = await request(app).post('/api/services/deny').send(
      {
        service: res.body.data._id,
      },
    );

    expect(response.status).toBe(200);
  });
  test('It should response service already canceled for POST method', async () => {
    const user = new models.User({
      name: 'everton',
      email: 'everton@jrabreu.com',
      password: '12345678',
    });

    await user.save();

    const client = await models.User.findOne({ email: 'everton@jrabreu.com' });

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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );

    await activity.save();

    const activityRequested = await models.ActivitiesProvider.findOne({ title: 'Azulejista' });

    const res = await request(app).post('/api/services').send(
      {
        client: client.id,
        provider: providerRequested.id,
        activity: activityRequested.id,
        description: 'description',
        value: 50,
      },
    );

    await models.Service.updateMany({}, { status: 0 });

    const response = await request(app).post('/api/services/deny').send(
      {
        service: res.body.data._id,
      },
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual('Service already canceled');
  });
  test('It should response service already denyed for POST method', async () => {
    const user = new models.User({
      name: 'everton',
      email: 'everton@jrabreu.com',
      password: '12345678',
    });

    await user.save();

    const client = await models.User.findOne({ email: 'everton@jrabreu.com' });

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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );

    await activity.save();

    const activityRequested = await models.ActivitiesProvider.findOne({ title: 'Azulejista' });

    const res = await request(app).post('/api/services').send(
      {
        client: client.id,
        provider: providerRequested.id,
        activity: activityRequested.id,
        description: 'description',
        value: 50,
      },
    );

    await models.Service.updateMany({}, { status: 3 });

    const response = await request(app).post('/api/services/deny').send(
      {
        service: res.body.data._id,
      },
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toStrictEqual('Service already denyed');
  });
  test('It should response service already accepted for POST method', async () => {
    const user = new models.User({
      name: 'everton',
      email: 'everton@jrabreu.com',
      password: '12345678',
    });

    await user.save();

    const client = await models.User.findOne({ email: 'everton@jrabreu.com' });

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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );

    await activity.save();

    const activityRequested = await models.ActivitiesProvider.findOne({ title: 'Azulejista' });

    const res = await request(app).post('/api/services').send(
      {
        client: client.id,
        provider: providerRequested.id,
        activity: activityRequested.id,
        description: 'description',
        value: 50,
      },
    );

    await models.Service.updateMany({}, { status: 2 });

    const response = await request(app).post('/api/services/deny').send(
      {
        service: res.body.data._id,
      },
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toStrictEqual('Service already accepted');
  });
  test('It should response service not found for POST method', async () => {
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
    const providerRequested = await models.Provider.findOne({ name: 'Dennis' });

    const response = await request(app).post('/api/services/deny').send(
      {
        service: providerRequested.id,
      },
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual('Service not found');
  });
});
