const { validationResult } = require('express-validator');

async function validateResult(req, res, next){
    try {
        validationResult(req).throw()
        return next()
    } catch (err) {
        res.status(403)
        res.send({ errors: err.array() })
    }
}

module.exports = { validateResult }