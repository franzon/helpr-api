/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const models = require('../../database/models');
const app = require('../../app');

describe('updateActivity', () => {
  test('It should returns succes for PUT method', async () => {
    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );
    await activity.save();

    const testId = activity.id;

    const res = await request(app).put(`/api/activities/${testId}`).send(
      {
        title: 'MUDANDO',
        description: 'TESTANDO UPDATE',
        price: '54321',
      },
    );

    expect(res.status).toBe(200);
    expect(res.body.message).toStrictEqual('success');
    expect(res.body.data).not.toBeNull();
  });
});

describe('deleteActivity', () => {
  test('It should returns success for the DELETE method', async () => {
    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );
    await activity.save();

    const testId = activity.id;

    const res = await request(app).delete(`/api/activities/${testId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toStrictEqual('success');
    expect(res.body.data).not.toBeNull();
  });

  test('Removes activity of provider when activity is removed', async () => {
    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );
    await activity.save();
    const activityId = activity._id;

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
      activities: [activityId],
    });

    await provider.save();
    const providerId = provider._id;

    activity.provider = providerId;

    await activity.save();

    await request(app).delete(`/api/activities/${activityId}`);

    provider = await models.Provider.findOne({ email: 'carlos@sumare.com' });

    expect(provider.activities).toHaveLength(0);
  });

  test('Removes activity of category when activity is removed', async () => {
    const activity = new models.ActivitiesProvider(
      {
        title: 'Azulejista',
        description: 'Arrumo azulejos',
        price: '12345',
      },
    );
    await activity.save();
    const activityId = activity._id;

    let category = new models.CategoriesProvider({
      identifier: 'Pedreiro',
      title: 'Pedreiro',
      activities: [activityId],
    });

    await category.save();
    const categoryId = category._id;

    activity.assignedTo = categoryId;
    await activity.save();

    await request(app).delete(`/api/activities/${activityId}`);

    category = await models.CategoriesProvider.findOne({ _id: categoryId });

    expect(category.activities).toHaveLength(0);
  });
});
