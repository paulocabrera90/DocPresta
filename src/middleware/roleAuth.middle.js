
const storage = require("../storage/session");
const { verifyToken } = require("../utils/generateToken");
const { User } = require('../models/index.models');

const checkRoleAuth = (roles, flagBo) => async (req, res, next) => {
    try {
        const token = storage.state.token;
        const tokenData = await verifyToken(token);
        console.log("Verify token", tokenData);
        userData = await User.findOne({ where: { id: tokenData.id } })
        
        console.log("userData", userData)    
        if ([].concat(roles).map(rol => rol.toLowerCase()).includes(userData.rol.toLowerCase())) {
            next()
        } else {
            res.status(401)
            res.send({ error: 'The user does not have permissions.' })
        }

    } catch (e) {
        console.log(e)
        res.status(401)
        res.send({ error: 'The user does not have permissions.' })
    }
}

module.exports = checkRoleAuth