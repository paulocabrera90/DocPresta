const { Router } = require("express");
const authorizationRoutes = require("./authorization.routes");
const medicalRecordRoutes = require("./medical-record.routes");
const usersRoutes = require("./users.routes");
const { goHome } = require("../controllers/home.controller");
const checkAuth = require("../middleware/auth.middle");

const routes_init = () => {
  const router = Router();

  router.use('/authorization', authorizationRoutes);
  router.use('/users', usersRoutes);
  router.use('/medical-record', medicalRecordRoutes);
  router.get('/home', goHome);
  
  router.use('/', (req, res) => {
    res.render('login');
  });
  


  return router;
}

module.exports = { routes_init }