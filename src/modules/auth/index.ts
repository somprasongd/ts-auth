import { RouterConfig } from '..';
import AuthController from './auth.controller';
import express from 'express';
import { authentication } from '../../middleware/authentication';

export const registerRoutes = ({ app, baseUrl, db }: RouterConfig) => {
  const ctrl = new AuthController(db);

  const router = express.Router();

  router.post('/sign-up', ctrl.signup);
  router.post('/sign-in', ctrl.signin);
  router.post('/sign-out', ctrl.signout);
  router.post('/refresh', ctrl.refresh);
  router.get('/profile', authentication, ctrl.profile);

  app.use(baseUrl + '/auth', router);
};
