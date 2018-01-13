// server.js
import { data } from './users.mock';

const jsonServer = require('json-server');  // tslint:disable-line
const server = jsonServer.create();
const router = jsonServer.router(data);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
