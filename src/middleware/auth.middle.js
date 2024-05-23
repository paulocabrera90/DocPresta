const { verifyToken } = require("../utils/generateToken");

async function checkAuth(req, res, next) {
    try {
        console.log("req.headers checkAuth", req.query.token)
        if (!req.query.token) {
            res.render('error', {statusCode: 400, message: 'Authorization header not provided.'});
        }
        
        //const token = req.headers.authorization.split(' ').pop();
        const token = req.query.token;
        console.log("token checkAuth", token)
        const tokenData = await verifyToken(token)
        
        if (!tokenData._id) {
            //res.status(500).render("./register", {err: "Please fill all the form elements"});    
            res.render('error', {statusCode: 409, message: 'Invalid Token Bearer: The provided token is invalid or has expired.'})//  sendError(res, 409, 'Invalid Token Bearer: The provided token is invalid or has expired.')
        }
        
        req.tokenId = tokenData._id;
        console.log("FIN checkAuth")
        next();
    } catch (e) {
        console.error(e)
        res.render('error', {statusCode: 401, message: 'Invalid Token Bearer: The provided token is invalid or has expired.'})// sendError(res, 401, 'Invalid Token Bearer: The provided token is invalid or has expired.')
    }
}

function sendError(res, statusCode, message) {
    res.status(statusCode).send({ error: message })
}

module.exports = checkAuth