const jwt = require('jsonwebtoken');

async function tokenSign(user, timeSession) {
    return jwt.sign(
        {
            _id: user._id,
            role: user.role
        },
        'docpresta-cabrera', 
        { expiresIn: timeSession, }
    );
}

async function verifyToken(token) {
    try {
        return jwt.verify(token, 'docpresta-cabrera')
    } catch (e) {
        return null
    }
}

async function decodeSign(token) {
    return jwt.decode(token, null)
}

module.exports = { tokenSign, decodeSign, verifyToken }