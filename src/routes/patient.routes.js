var express = require('express');
const { getPatientById, getListAllPatients, createPatient, newPatient, deletePatient, updatePatient, getPatientByDni } = require('../controllers/patient.controller');
const checkAuth = require('../middleware/auth.middle');
const checkRoleAuth = require('../middleware/roleAuth.middle');
const { validateRegister } = require('../validators/register.validator');

var router = express.Router();

router.get('/', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), getListAllPatients);

router.get('/new', checkAuth,checkRoleAuth(['ADMIN']), newPatient);

router.post('/create', checkAuth, checkRoleAuth(['ADMIN']), createPatient);

router.get('/:id', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), getPatientById);

router.get('/dni/:dni', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), getPatientByDni);

router.patch('/update/:id', checkAuth, checkRoleAuth(['ADMIN']),  updatePatient);

router.delete('/:id',checkAuth, checkRoleAuth(['ADMIN']), deletePatient);

module.exports = router;