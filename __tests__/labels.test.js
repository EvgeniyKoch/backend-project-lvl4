// @ts-check
import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test labels CRUD', () => {
  let app;
  let knex;
  let models;
  let cookie;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
    await knex.migrate.latest();
    await prepareData(app);
  });

  beforeEach(async () => {
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: testData.users.existing,
      },
    });
    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    cookie = { [name]: value };
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('labels'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);

    const responseCreate = await app.inject({
      method: 'POST',
      url: app.reverse('createLabel'),
      payload: {
        data: { name: 'test' },
      },
    });

    expect(responseCreate.statusCode).toBe(302);

    const label = await models.label.query().findOne({ name: 'test' });

    expect(label.name).toBe('test');
  });

  it('edit', async () => {
    const label = await models.label.query().findOne({ name: 'test' });

    const responseEditLabelPage = await app.inject({
      method: 'GET',
      url: app.reverse('editLabelPage', { id: label.id }),
      cookies: cookie,
    });

    expect(responseEditLabelPage.statusCode).toBe(200);

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('editLabel', { id: label.id }),
      payload: {
        data: { name: 'another label' },
      },
    });

    expect(response.statusCode).toBe(302);
    const updatedLabel = await models.label.query().findOne({ id: label.id });
    expect(updatedLabel.name).toBe('another label');
  });

  it('delete', async () => {
    const label = await models.label.query().findOne({ name: 'Major' });
    const responseDeleted = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteLabel', { id: label.id }),
    });

    expect(responseDeleted.statusCode).toBe(302);
  });

  afterAll(async () => {
    await app.close();
  });
});
