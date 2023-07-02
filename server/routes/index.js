// @ts-check

import welcome from './welcome.js';
import users from './users.js';
import session from './session.js';
import tasks from './tasks.js';
import statuses from './statuses.js';
import labels from './labels.js';

const controllers = [
  welcome,
  users,
  session,
  tasks,
  statuses,
  labels,
];

export default (app) => controllers.forEach((f) => f(app));
