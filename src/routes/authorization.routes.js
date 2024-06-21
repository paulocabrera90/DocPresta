const express = require('express');
const { loginCtrl, registerCtrl, checkToken } = require('../controllers/authorization.controller');
const checkRoleAuth = require('../middleware/roleAuth.middle');
const checkAuth = require('../middleware/auth.middle');
const { validateLogin, validateRegister } = require('../validators/register.validator');

const router = express.Router();

router.post('/login', validateLogin, loginCtrl);

//router.post('/login', loginCtrl);

router.post('/register', checkAuth, checkRoleAuth(['admin'], false), validateRegister, registerCtrl);

router.get('/check-token', checkAuth, checkToken);

module.exports = router