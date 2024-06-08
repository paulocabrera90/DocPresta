var express = require('express');
const { getPatient, getListAllPatients, createPatient, newPatient, deletePatient } = require('../controllers/patient.controller');
const checkAuth = require('../middleware/auth.middle');
const checkRoleAuth = require('../middleware/roleAuth.middle');

var router = express.Router();

router.get('/', checkAuth, getListAllPatients);

router.get('/new', checkAuth,checkRoleAuth(['ADMIN']), newPatient);

router.post('/create', checkAuth, checkRoleAuth(['ADMIN']), createPatient);

router.get('/:id', checkAuth, checkRoleAuth(['ADMIN']), getPatient);

router.patch('/:id');

router.delete('/:id',checkAuth, checkRoleAuth(['ADMIN']), deletePatient);

module.exports = router;