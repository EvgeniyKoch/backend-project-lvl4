// @ts-check
import i18next from 'i18next';

export default (app) => {
  app
    .get('/labels', { name: 'labels' }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { name: 'newLabel' }, async (req, reply) => {
      const labelsForm = {};
      reply.render('labels/new', { labelsForm });
      return reply;
    })
    .post('/labels', { name: 'createLabel' }, async (req, reply) => {
      const label = new app.objection.models.label();
      label.$set(req.body.data);
      try {
        const validLabel = await app.objection.models.label.fromJson(req.body.data);
        await app.objection.models.label.query().insert(validLabel);
        reply.redirect(app.reverse('labels'));
        req.flash('info', i18next.t('flash.labels.create.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label, errors: e.data });
      }
      return reply;
    })
    .get('/labels/:id/edit', { name: 'editLabelPage' }, async (req, reply) => {
      const { id } = req.params;
      const label = await app.objection.models.label.query().findById(id);
      reply.render('labels/edit', { label });
      return reply;
    })
    .patch('/labels/:id', { name: 'editLabel' }, async (req, reply) => {
      const { id } = req.params;
      const label = await app.objection.models.label.query().findById(id);

      try {
        await label.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.labels.edit.success'));
        reply.redirect(app.reverse('labels'));
      } catch (e) {
        req.flash('error', i18next.t('flash.labels.edit.error'));
        reply.render('labels/edit', { label, errors: e.data });
      }

      return reply;
    })
    .delete('/labels/:id', { name: 'deleteLabel' }, async (req, reply) => {
      const tasks = await app.objection.models.task.query().where('labelId', req.params.id);
      if (tasks.length > 0) {
        req.flash('error', i18next.t('flash.labels.delete.isExecutor'));
        reply.redirect(app.reverse('labels')).code(409);
        return;
      }

      const deletedCount = await app.objection.models.label.query().deleteById(req.params.id);
      if (deletedCount === 1) {
        req.flash('info', i18next.t('flash.labels.delete.success'));
        reply.redirect(app.reverse('labels'));
      } else {
        req.flash('error', i18next.t('flash.labels.delete.error'));
        reply.redirect(app.reverse('labels'));
      }
    });
};
