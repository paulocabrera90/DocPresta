var express = require('express');
const { getMedicineById, getListAllMedicines, createMedicine, newMedicine, deleteMedicine, updateMedicine } = require('../controllers/medicine.controller');
const checkAuth = require('../middleware/auth.middle');
const checkRoleAuth = require('../middleware/roleAuth.middle');

var router = express.Router();

router.get('/', checkAuth, getListAllMedicines);

router.get('/new', checkAuth,checkRoleAuth(['ADMIN','PROFESIONAL']), newMedicine);

router.post('/create', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), createMedicine);

router.get('/:id', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), getMedicineById);

router.patch('/update/:id', checkAuth, checkRoleAuth(['ADMIN','PROFESIONAL']), updateMedicine);

router.delete('/:id',checkAuth, checkRoleAuth(['ADMIN', 'PROFESIONAL']), deleteMedicine);

module.exports = router;