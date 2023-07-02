// @ts-check

import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import { getTestData, prepareData } from './helpers/index.js';

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
  let cookies;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;

    // TODO: пока один раз перед тестами
    // тесты не должны зависеть друг от друга
    // перед каждым тестом выполняем миграции
    // и заполняем БД тестовыми данными
    await knex.migrate.latest();
    await prepareData(app);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);

    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });

    expect(user).toMatchObject(expected);
  });

  it('update', async () => {
    const params = testData.users.new;
    // Авторизуемся в приложении
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: params },
    });

    expect(responseSignIn.statusCode).toBe(302);

    // Получаем пользователя
    const user = await models.user.query().findOne({ email: params.email });
    const { update } = testData.users;
    const [{ name, value }] = responseSignIn.cookies;
    cookies = { [name]: value };

    // Получаем страницу созданного пользователя
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: user.id }),
      cookies,
    });

    expect(response.statusCode).toBe(200);

    // Обновляем данные пользователя
    const resUpdateUser = await app.inject({
      method: 'PATCH',
      url: app.reverse('edit', { id: user.id }),
      payload: {
        data: update,
      },
    });

    expect(resUpdateUser.statusCode).toBe(302);

    // Проверяем, что данные пользователя были успешно обновлены
    const updatedUser = await models.user.query().findById(user.id);
    expect(updatedUser.email).toBe(update.email);
    expect(updatedUser.firstName).toBe(update.firstName);
    expect(updatedUser.lastName).toBe(update.lastName);
  });

  it('delete', async () => {
    const { update } = testData.users;
    const user = await models.user.query().findOne({ email: update.email });
    const responseDeleted = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id: user.id }),
      cookies,
    });

    expect(responseDeleted.statusCode).toBe(302);
  });

  // afterEach(async () => {
  // Пока Segmentation fault: 11
  // после каждого теста откатываем миграции
  // await knex.migrate.rollback();
  // });

  afterAll(async () => {
    await app.close();
  });
});
