// @ts-check
import fastify from 'fastify';

import init from '../server/plugin.js';
import {getTestData, prepareData} from './helpers/index.js';

describe('test statuses CRUD', () => {
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
      url: app.reverse('statuses'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);

    const responseCreate = await app.inject({
      method: 'POST',
      url: app.reverse('createStatus'),
      payload: {
        data: { name: 'test' },
      },
    });

    expect(responseCreate.statusCode).toBe(302);
    const status = await models.status.query().findOne({ name: 'test' });

    expect(status.name).toBe('test');
  });

  it('edit', async () => {
    const status = await models.status.query().findOne({ name: 'test' });

    const responseEditStatusPage = await app.inject({
      method: 'GET',
      url: app.reverse('editStatusPage', { id: status.id }),
      cookies: cookie,
    });

    expect(responseEditStatusPage.statusCode).toBe(200);

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('editStatus', { id: status.id }),
      payload: {
        data: { name: 'another task' },
      },
    });

    expect(response.statusCode).toBe(302);
    const updatedStatus = await models.status.query().findOne({ id: status.id });
    expect(updatedStatus.name).toBe('another task');
  });

  it('delete', async () => {
    const status = await models.status.query().findOne({ name: 'In progress' });
    const responseDeleted = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteStatus', { id: status.id }),
    });

    expect(responseDeleted.statusCode).toBe(302);
  });

  afterAll(async () => {
    await app.close();
  });
});
