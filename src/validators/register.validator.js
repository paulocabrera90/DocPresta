const { check } = require("express-validator")
const { validateResult } = require("../helpers/validateHelper")
const ROLES = ['admin', 'user', 'superadmin'];

const validateLogin = [ 
    check('email')
        .exists().withMessage('El campo de correo electrónico es obligatorio.')
        .isEmail().withMessage('Debe ingresar un correo electrónico válido.')
        .not().isEmpty().withMessage('El correo electrónico no puede estar vacío.'),
    check('password')
        .exists().withMessage('El campo de contraseña es obligatorio.')
        .not().isEmpty().withMessage('La contraseña no puede estar vacía.')
        .isLength({ min: 6, max: 15 }).withMessage('La contraseña debe tener entre 6 y 15 caracteres.'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const validateRegister = [
    check('username').not().isEmpty().withMessage('El campo de username es obligatorio.'),
    check('email').isEmail().withMessage('Debe ingresar un correo electrónico válido.'),
    // check('password')
    //     .isLength({ min: 6, max: 15 })
    //     .withMessage('La contraseña debe tener entre 6 y 15 caracteres.'),
    check('password')
        .exists().withMessage('El campo de contraseña es obligatorio.')
        .not().isEmpty().withMessage('La contraseña no puede estar vacía.')
        .isLength({ min: 6, max: 15 }).withMessage('La contraseña debe tener entre 6 y 15 caracteres.'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validateLogin, validateRegister }