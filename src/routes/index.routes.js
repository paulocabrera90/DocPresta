const { Router } = require("express");
const fs = require('fs').promises;
const authorizationRoutes = require("./authorization.routes");
const medicalRecordRoutes = require("./medical-record.routes");
const profesionalRoutes = require("./profesional.routes");
const medicineRoutes = require("./medicine.routes");
const patientRoutes = require("./patient.routes");
const usersRoutes = require("./users.routes");
const { goHome } = require("../controllers/home.controller");
const checkAuth = require("../middleware/auth.middle");

const routes_init = () => {
  const router = Router();

  router.use('/authorization', authorizationRoutes);
  router.use('/users', usersRoutes);
  router.use('/medical-record', medicalRecordRoutes);
  router.use('/profesional', profesionalRoutes);
  router.use('/patient', patientRoutes);
  router.use('/medicine', medicineRoutes);

  router.get('/home', checkAuth, goHome);
  router.use('/',  (req, res) => {
  //   try {
  //     await fs.unlink('./state.json');
  //     console.log('Archivo eliminado con éxito');
  // } catch (error) {
  //     console.error('Error al eliminar el archivo:', error);
  // }

    res.render('login');
  });
  


  return router;
}

module.exports = { routes_init }