const { Router } = require("express");
const authorizationRoutes = require("./authorization.routes");
const usersRoutes = require("./users.routes");

const routes_init = () => {
  const router = Router();

  router.use('/authorization', authorizationRoutes);
  router.use('/users', usersRoutes);
  //router.use('/', goIndex)

  return router;
}

module.exports = { routes_init }