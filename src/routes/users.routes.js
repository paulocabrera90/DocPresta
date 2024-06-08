var express = require('express');
var router = express.Router();
//const { getPatientController } = require('../controllers/patient.controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET patient with dni */
//router.get('/:dni', getPatientController);

module.exports = router;
