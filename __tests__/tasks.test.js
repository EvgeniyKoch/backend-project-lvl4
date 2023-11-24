// @ts-check
import fastify from 'fastify';

import { it } from '@jest/globals';
import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test tasks CRUD', () => {
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
      url: app.reverse('tasks'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
  });

  it('index - with filters', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks') + '?data[statuses]=1&data[executors]=1',
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);

    const responseCreate = await app.inject({
      method: 'POST',
      url: app.reverse('createTask'),
      payload: {
        data: {
          name: 'test',
          description: 'task test',
          statusId: 1,
          executorId: 1,
        },
      },
      cookies: cookie,
    });

    expect(responseCreate.statusCode).toBe(302);

    const task = await models.task.query().findOne({ name: 'test' });

    expect(task.name).toBe('test');
    expect(task.description).toBe('task test');
  });

  it('show task', async () => {
    const task = await models.task.query().findOne({ name: 'test' });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('showTask', { id: task.id }),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
  });

  it('edit', async () => {
    const task = await models.task.query().findOne({ name: 'test' });
    const responseEditTaskPage = await app.inject({
      method: 'GET',
      url: app.reverse('editTaskPage', { id: task.id }),
      cookies: cookie,
    });

    expect(responseEditTaskPage.statusCode).toBe(200);

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('editTask', { id: task.id }),
      payload: {
        data: {
          ...task,
          name: 'another task',
          description: 'local task',
        },
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);

    const updatedTask = await models.task.query().findById(task.id);
    expect(updatedTask.name).toBe('another task');
  });

  it('delete', async () => {
    const task = await models.task.query().findOne({ name: 'another task' });
    const response = await app.inject({
      mathod: 'DELETE',
      url: app.reverse('deleteTask', { id: task.id }),
    });

    expect(response.statusCode).toBe(302);
  });

  afterAll(async () => {
    await app.close();
  });
});
