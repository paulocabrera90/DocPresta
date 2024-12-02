const storage = require("../storage/session");
const { verifyToken } = require("../utils/generateToken");

async function checkAuth(req, res, next) {
    try {
        if (!storage.state.token) {
            res.render('error', {statusCode: 400, message: 'El hedear no provee autorizacion.'});
        }
        
        const token = storage.state.token;
        const tokenData = await verifyToken(token)
        
        if (!tokenData.id) {

            res.render('error', {statusCode: 409, message: 'Token no válido: El token proporcionado no es válido o ha expirado.'})
        }
        
        req.tokenId = tokenData.id;
        next();
    } catch (e) {
        console.error(e)
        res.render('error', {statusCode: 401, message: 'Token no válido: El token proporcionado no es válido o ha expirado.'})
    }
}

function sendError(res, statusCode, message) {
    res.status(statusCode).send({ error: message })
}

module.exports = checkAuth