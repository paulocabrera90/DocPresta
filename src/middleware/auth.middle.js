const { verifyToken } = require("../utils/generateToken");
const storage = require('handy-storage');

async function checkAuth(req, res, next) {
    try {
        console.log("req.headers", req.headers)
        if (!req.headers.authorization) {
            res.render('error', {statusCode: 400, message: 'Authorization header not provided.'});
        }
        
        const token = storage.state.token;//req.headers.authorization.split(' ').pop()
        const tokenData = await verifyToken(token)
        
        if (!tokenData._id) {
            //res.status(500).render("./register", {err: "Please fill all the form elements"});    
            res.render('error', {statusCode: 409, message: 'Invalid Token Bearer: The provided token is invalid or has expired.'})//  sendError(res, 409, 'Invalid Token Bearer: The provided token is invalid or has expired.')
        }
        req.tokenId = tokenData._id;
        next()
    } catch (e) {
        console.error(e)
        res.render('error', {statusCode: 401, message: 'Invalid Token Bearer: The provided token is invalid or has expired.'})// sendError(res, 401, 'Invalid Token Bearer: The provided token is invalid or has expired.')
    }
}

function sendError(res, statusCode, message) {
    res.status(statusCode).send({ error: message })
}

module.exports = checkAuth