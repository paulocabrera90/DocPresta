const storage = require("../storage/session");
const { verifyToken } = require("../utils/generateToken");

async function checkAuth(req, res, next) {
    try {
        if (!storage.state.token) {
            res.render('error', {statusCode: 400, message: 'Authorization header not provided.'});
        }
        
        //const token = req.headers.authorization.split(' ').pop();
        const token = storage.state.token;
        const tokenData = await verifyToken(token)
        
        if (!tokenData.id) {
            //res.status(500).render("./register", {err: "Please fill all the form elements"});    
            res.render('error', {statusCode: 409, message: 'Token no válido: El token proporcionado no es válido o ha expirado.'})//  sendError(res, 409, 'Invalid Token Bearer: The provided token is invalid or has expired.')
        }
        
        req.tokenId = tokenData.id;
        next();
    } catch (e) {
        console.error(e)
        res.render('error', {statusCode: 401, message: 'Token no válido: El token proporcionado no es válido o ha expirado.'})// sendError(res, 401, 'Invalid Token Bearer: The provided token is invalid or has expired.')
    }
}

function sendError(res, statusCode, message) {
    res.status(statusCode).send({ error: message })
}

module.exports = checkAuth