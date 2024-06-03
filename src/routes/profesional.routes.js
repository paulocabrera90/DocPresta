var express = require('express');
const { getListAllProfesional, createProfesional } = require('../controllers/profesional.controller');
const checkAuth = require('../middleware/auth.middle');
const checkRoleAuth = require('../middleware/roleAuth.middle');

var router = express.Router();

router.get('/', checkAuth, getListAllProfesional);

router.post('/new', checkAuth, checkRoleAuth(['ADMIN']), createProfesional);

module.exports = router;