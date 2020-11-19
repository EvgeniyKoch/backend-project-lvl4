#! /usr/bin/env node
import getApp from '../index.js';

const port = process.env.PORT || 5000;
const address = '0.0.0.0';
const app = getApp();

app.listen(port, address, () => {
  app.log.info(`server listening on ${port}`);
});
