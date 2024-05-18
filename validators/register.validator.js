const { check } = require("express-validator")
const { validateResult } = require("../helpers/validateHelper")
const ROLES = ['admin', 'user', 'superadmin'];

const validateLogin = [ 
    check('email')
        .exists()
        .isEmail()
        .not()
        .isEmpty(),
    check('password')
        .exists()
        .not()
        .isEmpty()
        .isLength({min:6, max:15}),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const validateRegister = [ 
    check('firstName')
        .exists()
        .not()
        .isEmpty(),
    check('lastName')
        .exists()
        .not()
        .isEmpty(),
    check('email')
        .exists()
        .isEmail()
        .not()
        .isEmpty(),
    check('password')
        .exists()
        .not()
        .isEmpty()
        .isLength({min:6, max:15}),
    check('role')
        .exists()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            if(!ROLES.includes(value.toLowerCase())){
                throw new Error('Invalid user role.')
            }
            return true;
        }),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validateLogin, validateRegister }