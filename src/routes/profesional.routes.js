var express = require('express');
const { getListAllProfesional, createProfesional, updateProfesional, newProfesional, deleteProfesional, getProfesionalById} = require('../controllers/profesional.controller');
const checkAuth = require('../middleware/auth.middle');
const checkRoleAuth = require('../middleware/roleAuth.middle');
const { validateRegister } = require('../validators/register.validator');

var router = express.Router();

router.get('/', checkAuth, getListAllProfesional);

router.get('/new', checkAuth,checkRoleAuth(['ADMIN']), newProfesional);

router.post('/create', checkAuth, checkRoleAuth(['ADMIN']), validateRegister, createProfesional);

router.get('/:id', checkAuth, checkRoleAuth(['ADMIN']), getProfesionalById);

router.patch('/update/:id', checkAuth, checkRoleAuth(['ADMIN']), updateProfesional);

router.delete('/:id',checkAuth, checkRoleAuth(['ADMIN']), deleteProfesional);

module.exports = router;