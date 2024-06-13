var express = require('express');
const { medicalRecordNew, getListAllMedicalRecord } = require('../controllers/medical-record.controller');
const checkAuth = require("../middleware/auth.middle");
const checkRoleAuth = require('../middleware/roleAuth.middle');
var router = express.Router();

/* GET users listing. */
router.get('/new', checkAuth,checkRoleAuth([,'PROFESIONAL']), medicalRecordNew);

router.get('/', checkAuth,checkRoleAuth([,'PROFESIONAL']), getListAllMedicalRecord);

// router.post('/create', checkAuth, checkRoleAuth(['PROFESIONAL']), createMedicalRecord);

// router.get('/:id', checkAuth, checkRoleAuth(['PROFESIONAL']), getMedicalRecordById);

// router.patch('/update/:id', checkAuth, checkRoleAuth(['PROFESIONAL']), updateMedicalRecord);

// router.delete('/:id',checkAuth, checkRoleAuth(['PROFESIONAL']), deleteMedicalRecord);


module.exports = router;
