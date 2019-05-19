const request = require('supertest');
const models = require('../../database/models');
const app = require('../../app');

describe('addCategory', () => {
  test('It should responde success for POST method', async () => {
    const res = await request(app).post('/api/categories/').send(
      {
        identifier: 'Plumber',
        title: 'Encanador',
        activities: [
          {
            title: 'Vazamentos',
            description: 'Consertamos vazamentos em geral',
            price: '200',
          },
        ],
      },
    );

    expect(res.status).toBe(200);
    expect(res.body.message).toStrictEqual('category created');
    expect(res.body.data).not.toBeNull();
  });

  test('It should response error for POST method when a category with same name already created', async () => {
    const category = new models.CategoriesProvider(
      {
        identifier: 'Plumber',
        title: 'Encanador',
        activities: [],
      },
    );

    await category.save();

    const res = await request(app).post('/api/categories/').send(
      {
        identifier: 'Plumber',
        title: 'Encanador',
        activities: [],
      },
    );

    expect(category).not.toBeNull();
    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('category already created');
    expect(res.body.data).toBeNull();
  });
});

describe('getCategories', () => {
  test('It should response sucess for GET method, returns all categories', async () => {
    const category1 = new models.CategoriesProvider(
      {
        identifier: 'Plumber',
        title: 'Encanador',
        activities: [],
      },
    );
    const category2 = new models.CategoriesProvider(
      {
        identifier: 'Builder',
        title: 'Pedreiro',
        activities: [],
      },
    );

    await category1.save();
    await category2.save();

    const res = await request(app).get('/api/categories/getCategories');

    expect(res.status).toBe(200);
    expect(res.body.message).toStrictEqual('success');
  });
});

describe('getCategoryById', () => {
  test('It should response success for GET method', async () => {
    const category = new models.CategoriesProvider(
      {
        identifier: 'Builder',
        title: 'Pedreiro',
        activities: [],
      },
    );

    await category.save();

    const res = await request(app).get('/api/categories/getCategory/Builder');

    expect(res.status).toBe(200);
    expect(res.body.message).toStrictEqual('success');
    expect(res.body.data).not.toBeNull();
    expect(category).not.toBeNull();
  });

  test('It should response error for GET method when category not exists', async () => {
    const res = await request(app).get('/api/categories/getCategory/Marceneiro');

    expect(res.body.message).toStrictEqual('category not found');
    expect(res.status).toBe(400);
    expect(res.body.data).toBeNull();
  });
});

describe('getCategoriesAndActivities', () => {
  test('It should response success for GET method, categories and activities', async () => {
    const category = new models.CategoriesProvider(
      {
        identifier: 'Builder',
        title: 'Pedreiro',
        activities: [],
      },
    );

    await category.save();

    const res = await request(app).get('/api/categories/getCategoriesAndActivities');

    expect(res.status).toBe(200);
    expect(res.body.message).toStrictEqual('success');
    expect(res.body.data).not.toBeNull();
  });
});

describe('deleteCategory', () => {
  test('It should be response success for DELET method', async () => {
    const category = new models.CategoriesProvider(
      {
        identifier: 'Pumbler',
        title: 'Pedreiro',
        activities: [],
      },
    );

    await category.save();

    const res = await request(app).delete('/api/categories/deleteCategory/Pumbler');

    expect(res.status).toBe(200);
    expect(res.body.message).toStrictEqual('success');
    expect(res.body.data).not.toBeNull();
  });

  test('It should be response error for DELET method, category not', async () => {
    const category = new models.CategoriesProvider(
      {
        identifier: 'Builder',
        title: 'Pedreiro',
        activities: [],
      },
    );

    await category.save();

    const res = await request(app).delete('/api/categories/deleteCategory/Pumbler');

    expect(res.status).toBe(400);
    expect(res.body.message).toStrictEqual('category not found');
    expect(res.body.data).toBeNull();
  });
});
