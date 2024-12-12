const { Router } = require("express");
const fs = require('fs').promises;
const authorizationRoutes = require("./authorization.routes");
const medicalRecordRoutes = require("./medical-record.routes");
const profesionalRoutes = require("./profesional.routes");
const medicineRoutes = require("./medicine.routes");
const patientRoutes = require("./patient.routes");
const benefitRoutes = require("./benefit.routes");
const usersRoutes = require("./users.routes");

const { goHome } = require("../controllers/home.controller");
const checkAuth = require("../middleware/auth.middle");
const storage = require("../storage/session");
const { verifyToken } = require("../utils/generateToken");
const { goAdmin } = require("../controllers/admin.controller");

const routes_init = () => {
  const router = Router();

  router.use('/authorization', authorizationRoutes);
  router.use('/users', usersRoutes);
  router.use('/medical-record', medicalRecordRoutes);
  router.use('/profesional', profesionalRoutes);
  router.use('/patient', patientRoutes);
  router.use('/benefit', benefitRoutes);
  router.use('/medicine', medicineRoutes);

  router.get('/home', checkAuth, goHome);

  router.get('/admin', checkAuth, goAdmin);

  router.use('/logout', async (req, res) => { 

    try {        
      await storage.setState({
        token: "",
        user:""
      })       
      res.redirect('/');
    } catch (error) {
        console.error('Error al eliminar el archivo:', error);
        res.status(500).send('No se pudo eliminar el archivo.');
    } 

  });

  router.use('/', async  (req, res) => {
      const very = await verifyToken(storage.state.token)
        
      console.log("login", very)
        if(very && very.id){
          if(very.rol === 'ADMIN'){
            res.redirect('/api/admin');  
          }else{
            res.redirect('/api/medical-record');  
          }
        } else {
          res.render('login');
        }
  });
  return router;
}

module.exports = { routes_init }