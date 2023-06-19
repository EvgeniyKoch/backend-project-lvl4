// @ts-check
import fastify from 'fastify';

import init from '../server/plugin.js';
import { prepareData } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;

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

  beforeEach(async () => {});

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
    });
    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
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

  afterAll(async () => {
    await app.close();
  });
});
