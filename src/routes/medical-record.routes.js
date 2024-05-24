var express = require('express');
const { medicalRecordNew } = require('../controllers/medical-record.controller');
var router = express.Router();

/* GET users listing. */
router.get('/new', medicalRecordNew);

module.exports = router;
