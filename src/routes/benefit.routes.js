var express = require('express');
const { newBenefitController, getListAllBenefitsController, createBenefitController, getFindBenefitByIdController, deleteBenefitController, updateBenefitController } = require('../controllers/benefit.controller');
const checkAuth = require('../middleware/auth.middle');
const checkRoleAuth = require('../middleware/roleAuth.middle');
const { updateBenefitService } = require('../services/benefit.service');

var router = express.Router();

router.get('/', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), getListAllBenefitsController);

router.get('/new', checkAuth,checkRoleAuth(['ADMIN']), newBenefitController);

router.post('/create', checkAuth, checkRoleAuth(['ADMIN']), createBenefitController);

router.get('/:id', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), getFindBenefitByIdController);

router.patch('/update/:id', checkAuth, checkRoleAuth(['ADMIN']), updateBenefitController);

router.delete('/:id',checkAuth, checkRoleAuth(['ADMIN']), deleteBenefitController);

router.get('/form', (req, res) => {
    const benefit = req.query.id ? getBenefitById(req.query.id) : null;
    const sections = getAllSections(); // Asumiendo que tienes una función para obtener las secciones
    res.render('benefit-form', { benefit, sections });
});

module.exports = router;