import { RouterConfig } from '..';
import UserController from './users.controller';
import express from 'express';
import { authentication } from '../../middleware/authentication';
import { authorization } from '../../middleware/authorization';

export const registerRoutes = ({ app, baseUrl, db }: RouterConfig) => {
  const ctrl = new UserController(db);

  const router = express.Router();

  router.post('/', authentication, authorization, ctrl.create);
  router.get('/', authentication, authorization, ctrl.list);

  app.use(baseUrl + '/users', router);
};
