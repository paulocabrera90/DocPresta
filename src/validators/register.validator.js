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
    check('firstName')
        .exists().withMessage('El campo de nombre es obligatorio.')
        .not().isEmpty().withMessage('El nombre no puede estar vacío.'),
    check('lastName')
        .exists().withMessage('El campo de apellido es obligatorio.')
        .not().isEmpty().withMessage('El apellido no puede estar vacío.'),
    check('email')
        .exists().withMessage('El campo de correo electrónico es obligatorio.')
        .isEmail().withMessage('Debe ingresar un correo electrónico válido.')
        .not().isEmpty().withMessage('El correo electrónico no puede estar vacío.'),
    check('password')
        .exists().withMessage('El campo de contraseña es obligatorio.')
        .not().isEmpty().withMessage('La contraseña no puede estar vacía.')
        .isLength({ min: 6, max: 15 }).withMessage('La contraseña debe tener entre 6 y 15 caracteres.'),
    check('role')
        .exists().withMessage('El campo de rol es obligatorio.')
        .not().isEmpty().withMessage('El rol no puede estar vacío.')
        .custom((value, { req }) => {
            if (!ROLES.includes(value.toLowerCase())) {
                throw new Error('Rol de usuario inválido.')
            }
            return true;
        }),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validateLogin, validateRegister }