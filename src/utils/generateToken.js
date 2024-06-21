const jwt = require('jsonwebtoken');
const JWT_SECRET = "docpresta_cabrera";
const TIME_SESSION = "2h";

async function tokenSign(user) {
    return jwt.sign(
        {
            id: user.id,
            rol: user.rol,
            email: user.email,
            state: user.state
        },
        JWT_SECRET, 
        { expiresIn: TIME_SESSION, }
    );
}

async function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (e) {
        return null
    }
}

async function decodeSign(token) {
    return jwt.decode(token, null)
}

module.exports = { tokenSign, decodeSign, verifyToken }