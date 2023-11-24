// @ts-check
import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      try {
        const { data } = req.query;
        const { models } = app.objection;

        const [statuses, labels] = await Promise.all([
          models.status.query(),
          models.label.query(),
        ]);

        const query = models.task.query()
          .withGraphJoined('[creator(selectFullName), executor(selectFullName), status]')
          .modifiers({ selectFullName: (builder) => builder.select('firstName', 'lastName') })
          .modify((builder) => {
            if (data?.statuses) builder.where('statusId', data.statuses);
            if (data?.executors) builder.where('executorId', data.executors);
            if (data?.labels) builder.where('labelId', data.labels);
            if (data?.isCreatorUser) builder.where('creatorId', req.user.id);
          });

        const tasks = await query;

        const executors = Array.from(new Map(tasks.map((task) => [
          task.executorId,
          { id: task.executorId, name: `${task.executor.firstName} ${task.executor.lastName}` },
        ])).values());

        reply.render('tasks/index', {
          tasks,
          statuses,
          labels,
          executors,
          params: {
            statusId: data?.statuses,
            labelId: data?.labels,
            executorId: data?.executors,
            isCreatorUser: data?.isCreatorUser,
          },
        });
      } catch (error) {
        reply.code(500).send({ error: 'Internal Server Error' });
      }

      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      const task = { statuses, users, labels };
      reply.render('tasks/new', { task });
      return reply;
    })
    .get('/tasks/:id', { name: 'showTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      try {
        const task = await app.objection.models.task.query()
          .findById(id)
          .withGraphFetched('[creator(selectFullName), executor(selectFullName), status]')
          .modifiers({
            selectFullName: (builder) => {
              builder.select('firstName', 'lastName');
            },
          });
        reply.render('tasks/view', { task });
      } catch (e) {
        req.flash('error', i18next.t('flash.tasks.view.error'));
        reply.redirect(app.reverse('tasks'));
      }
      return reply;
    })
    .post('/tasks', { name: 'createTask' }, async (req, reply) => {
      const task = new app.objection.models.task();
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const updatedTask = {
        ...req.body.data,
        creatorId: Number(req.user.id),
        statusId: Number(req.body.data.statusId),
      };
      task.$set(updatedTask);
      try {
        const validTask = await app.objection.models.task.fromJson(updatedTask);
        await app.objection.models.task.query().insert(validTask);
        reply.redirect(app.reverse('tasks'));
        req.flash('info', i18next.t('flash.tasks.create.success'));
      } catch (e) {
        reply.render('tasks/new', { task: { ...updatedTask, statuses, users }, errors: e.data });
        req.flash('error', i18next.t('flash.tasks.create.error'));
      }
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTaskPage', preValidation: app.authenticate }, async (req, reply) => {
      const taskId = req.params.id;
      const task = await app.objection.models.task.query().findById(taskId);
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();

      reply.render('tasks/edit', {
        task, statuses, users, labels,
      });
      return reply;
    })
    .patch('/task/:id', { name: 'editTask' }, async (req, reply) => {
      const { id } = req.params;
      const updatedTask = {
        ...req.body.data,
        creatorId: Number(req.user.id),
        statusId: Number(req.body.data.statusId),
        labelId: Number(req.body.data.labelId),
        executorId: Number(req.body.data.executorId),
      };

      try {
        const task = await app.objection.models.task.query().findById(id);
        const validTask = await app.objection.models.task.fromJson(updatedTask);
        await task.$query().patch(validTask);
        reply.redirect(app.reverse('tasks'));
      } catch (e) {
        req.flash('error', i18next.t('flash.task.edit.error'));
        reply.render('tasks/edit', { task: updatedTask, errors: e.data });
      }
      return reply;
    })
    .delete('/tasks/:id', { name: 'deleteTask' }, async (req, reply) => {
      const deletedCount = await app.objection.models.task.query().deleteById(req.params.id);
      if (deletedCount === 1) {
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect(app.reverse('tasks'));
      } else {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        reply.redirect(app.reverse('tasks'));
      }
    });
};
