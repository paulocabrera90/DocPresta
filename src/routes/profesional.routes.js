var express = require('express');
const { getListAllProfesional } = require('../controllers/profesional.controller');
const checkAuth = require('../middleware/auth.middle');
var router = express.Router();

router.get('/', checkAuth, getListAllProfesional);

module.exports = router;