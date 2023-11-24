// @ts-check
import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses', preValidation: app.authenticate }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus', preValidation: app.authenticate }, async (req, reply) => {
      const statusesForm = {};
      reply.render('statuses/new', { statusesForm });
      return reply;
    })
    .post('/statuses', { name: 'createStatus' }, async (req, reply) => {
      const status = new app.objection.models.status();
      status.$set(req.body.data);
      try {
        const validStatus = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(validStatus);
        reply.redirect(app.reverse('statuses'));
        req.flash('info', i18next.t('flash.statuses.create.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors: e.data });
      }
      return reply;
    })
    .get('/statuses/:id/edit', { name: 'editStatusPage', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const status = await app.objection.models.status.query().findById(id);
      reply.render('statuses/edit', { status });
      return reply;
    })
    .patch('/statuses/:id', { name: 'editStatus' }, async (req, reply) => {
      const { id } = req.params;
      const status = await app.objection.models.status.query().findById(id);

      try {
        await status.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.statuses.edit.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (e) {
        req.flash('error', i18next.t('flash.statuses.edit.error'));
        reply.render('statuses/edit', { status, errors: e.data });
      }

      return reply;
    })
    .delete('/statuses/:id', { name: 'deleteStatus' }, async (req, reply) => {
      const task = await app.objection.models.task.query().where('statusId', req.params.id);

      if (task.length > 0) {
        req.flash('error', i18next.t('flash.statuses.delete.isExecutor'));
        reply.redirect(app.reverse('statuses')).code(409);
        return;
      }

      const deletedCount = await app.objection.models.status.query().deleteById(req.params.id);
      if (deletedCount === 1) {
        req.flash('info', i18next.t('flash.statuses.delete.success'));
        reply.redirect(app.reverse('statuses'));
      } else {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        reply.redirect(app.reverse('statuses'));
      }
    });
};
