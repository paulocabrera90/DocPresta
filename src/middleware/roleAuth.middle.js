
const storage = require("../storage/session");
const { verifyToken } = require("../utils/generateToken");
const { User } = require('../models/index.models');

const checkRoleAuth = (roles, flagBo) => async (req, res, next) => {
    try {
        const token = storage.state.token;
        const tokenData = await verifyToken(token);

        userData = await User.findOne({ where: { id: tokenData.id } })
        
        if ([].concat(roles).map(rol => rol.toLowerCase()).includes(userData.rol.toLowerCase())) {
            next()
        } else {
            res.status(401)
            res.send({ error: 'El usuario no tiene permisos.' })
        }

    } catch (e) {
        console.log(e)
        res.status(401)
        res.send({ error: 'El usuario no tiene permisos.' })
    }
}

module.exports = checkRoleAuth