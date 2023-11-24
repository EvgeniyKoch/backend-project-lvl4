// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (_, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (_, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (e) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: e.data });
      }

      return reply;
    })
    .get('/users/:id/edit', { name: 'editUser', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;

      if (req.user.id.toString() === id) {
        reply.render('users/editUser', { user: req.user });
        return reply;
      }

      req.flash('error', i18next.t('flash.users.update.notAvalible'));
      reply.redirect(app.reverse('users'));
      return reply;
    })
    .patch('/users/:id', { name: 'edit' }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);

      try {
        await user.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(app.reverse('root'));
      } catch (e) {
        req.flash('error', i18next.t('flash.users.update.error'));
        reply.render('users/editUser', { user: req.user, errors: e.data });
      }

      return reply;
    })
    .delete('/users/:id', { name: 'deleteUser', preValidation: app.authenticate }, async (req, reply) => {
      const task = await app.objection.models.task.query().where('executorId', req.params.id);

      if (task.length > 0) {
        req.flash('error', i18next.t('flash.users.delete.isExecutor'));
        reply.redirect(app.reverse('users')).code(409);
        return;
      }

      if (req.user.id.toString() === req.params.id) {
        const deletedCount = await app.objection.models.user.query().deleteById(req.params.id);
        if (deletedCount === 1) {
          req.flash('info', i18next.t('flash.users.delete.success'));
          req.logOut();
          reply.redirect(app.reverse('root'));
        } else {
          req.flash('error', i18next.t('flash.users.delete.error'));
          reply.redirect(app.reverse('users'));
        }
        return;
      }

      req.flash('error', i18next.t('flash.users.delete.notAvalible'));
      reply.redirect(app.reverse('users'));
    });
};
