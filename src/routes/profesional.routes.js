var express = require('express');
const { getListAllProfesional, createProfesional, newProfesional, deleteProfesional} = require('../controllers/profesional.controller');
const checkAuth = require('../middleware/auth.middle');
const checkRoleAuth = require('../middleware/roleAuth.middle');

var router = express.Router();

router.get('/', checkAuth, getListAllProfesional);

router.get('/new', checkAuth,checkRoleAuth(['ADMIN']), newProfesional);

router.post('/create', checkAuth, checkRoleAuth(['ADMIN']), createProfesional);

router.get('/:id');

router.patch('/:id');

router.delete('/:id',checkAuth, checkRoleAuth(['ADMIN']), deleteProfesional);

module.exports = router;