var express = require('express');
const { newBenefitController, getListAllBenefitsController, createBenefitController, getFindBenefitByIdController, deleteBenefitController, updateBenefitController } = require('../controllers/benefit.controller');
const checkAuth = require('../middleware/auth.middle');
const checkRoleAuth = require('../middleware/roleAuth.middle');
const { updateBenefitService } = require('../services/benefit.service');

var router = express.Router();

router.get('/', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), getListAllBenefitsController);

router.get('/new', checkAuth,checkRoleAuth(['ADMIN','PROFESIONAL']), newBenefitController);

router.post('/create', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), createBenefitController);

router.get('/:id', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), getFindBenefitByIdController);

router.patch('/update/:id', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), updateBenefitController);

router.delete('/:id',checkAuth, checkRoleAuth(['ADMIN', 'PROFESIONAL']), deleteBenefitController);

module.exports = router;