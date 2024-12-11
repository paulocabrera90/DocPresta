var express = require('express');
const { medicalRecordNew, getListAllMedicalRecord, generatePdf, createMedicalRecord, getMedicalRecordById, updateMedicalRecord, deleteMedicalRecord, getMedicalRecordByPatientId } = require('../controllers/medical-record.controller');
const checkAuth = require("../middleware/auth.middle");
const checkRoleAuth = require('../middleware/roleAuth.middle');
var router = express.Router();

/* GET users listing. */
router.get('/new', checkAuth, checkRoleAuth(['PROFESIONAL']), medicalRecordNew);

router.get('/', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), getListAllMedicalRecord);

router.get('/patient/:id', checkAuth, checkRoleAuth(['PACIENTE','PROFESIONAL']), getMedicalRecordByPatientId);

router.get('/generate-pdf', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), generatePdf);

router.post('/create', checkAuth, checkRoleAuth(['PROFESIONAL']), createMedicalRecord);

router.get('/:id', checkAuth, checkRoleAuth(['PROFESIONAL']), getMedicalRecordById);

router.patch('/update/:id', checkAuth, checkRoleAuth(['PROFESIONAL']), updateMedicalRecord);

router.delete('/:id',checkAuth, checkRoleAuth(['PROFESIONAL']), deleteMedicalRecord);

module.exports = router;
