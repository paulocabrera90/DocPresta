const usersModels = require("../models/user.models")
const { verifyToken } = require("../utils/generateToken")

const checkRoleAuth = (roles, flagBo) => async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ').pop()
        const tokenData = await verifyToken(token)
        userData = await usersModels.findById(tokenData._id)
        
        console.log("userData", userData)    
        if ([].concat(roles).map(role => role.toLowerCase()).includes(userData.role.toLowerCase())) {
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