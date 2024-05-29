var express = require('express');
const { medicalRecordNew } = require('../controllers/medical-record.controller');
const checkAuth = require("../middleware/auth.middle");
var router = express.Router();

/* GET users listing. */
router.get('/new', checkAuth, medicalRecordNew);

module.exports = router;
