var express = require('express');
const { newBenefitController, getListAllBenefitsController, createBenefitController, getFindBenefitByIdController } = require('../controllers/benefit.controller');
const checkAuth = require('../middleware/auth.middle');
const checkRoleAuth = require('../middleware/roleAuth.middle');

var router = express.Router();

router.get('/', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), getListAllBenefitsController);

router.get('/new', checkAuth,checkRoleAuth(['ADMIN','PROFESIONAL']), newBenefitController);

router.post('/create', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), createBenefitController);

 router.get('/:id', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), getFindBenefitByIdController);

// router.get('/dni/:dni', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), getPatientByDni);

// router.patch('/update/:id', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), updatePatient);

// router.delete('/:id',checkAuth, checkRoleAuth(['ADMIN', 'PROFESIONAL']), deletePatient);

module.exports = router;