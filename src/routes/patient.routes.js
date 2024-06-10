var express = require('express');
const { getPatientById, getListAllPatients, createPatient, newPatient, deletePatient, updatePatient } = require('../controllers/patient.controller');
const checkAuth = require('../middleware/auth.middle');
const checkRoleAuth = require('../middleware/roleAuth.middle');

var router = express.Router();

router.get('/', checkAuth, getListAllPatients);

router.get('/new', checkAuth,checkRoleAuth(['ADMIN','PROFESIONAL']), newPatient);

router.post('/create', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), createPatient);

router.get('/:id', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), getPatientById);

router.patch('/update/:id', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), updatePatient);

router.delete('/:id',checkAuth, checkRoleAuth(['ADMIN', 'PROFESIONAL']), deletePatient);

module.exports = router;