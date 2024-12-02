var express = require('express');
const { getMedicineByIdController,  createMedicineController, updateMedicineController, deleteMedicineController, newMedicineController, getListAllMedicinesController } = require('../controllers/medicine.controller');
const checkAuth = require('../middleware/auth.middle');
const checkRoleAuth = require('../middleware/roleAuth.middle');

var router = express.Router();

router.get('/', checkAuth,checkRoleAuth(['ADMIN','PROFESIONAL']), getListAllMedicinesController);

router.get('/new', checkAuth,checkRoleAuth(['PROFESIONAL']), newMedicineController);

router.post('/create', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), createMedicineController);

router.get('/:id', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), getMedicineByIdController);

router.patch('/update/:id', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), updateMedicineController);

router.delete('/:id',checkAuth, checkRoleAuth(['ADMIN', 'PROFESIONAL']), deleteMedicineController);

module.exports = router;