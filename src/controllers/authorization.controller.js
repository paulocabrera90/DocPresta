const { tokenSign } = require("../utils/generateToken");
const { encrypt } = require("../utils/handleBcrypt");
const authService = require('../services/authorization.service');
const { User } = require('../models/index.models');
const { httpError } = require("../helpers/handleError"); 

const privilegedRoles = ["admin"];

async function loginCtrl(req, res) {
    try {
        const { email, password } = req.body;
        const userData = await authService.login(email, password);
        
        res.json({ userData });
        
    } catch (error) {        
            httpError(res, error);        
    }
}

async function registerCtrl(req, res) {
    try {
        
        const {   
            username,
            email,          
            password,          
            profilePic,          
            rol 
        } = req.body

        const passwordHash = await encrypt(password)
        const registerUser = await User.create({
            username,
            email,          
            hashPassword: passwordHash,          
            profilePic,
            state: true,
            crationDate: Date.now(),
            modificationDate: Date.now(),
            rol
        })

        const responseData = {
            id: registerUser.id,
            email: registerUser.email,            
            firstName: registerUser.firstName,
            lastName: registerUser.lastName,
            role: registerUser.role
        };

        res.send({ data: responseData })

    } catch (e) {
        httpError(res, e)
    }
}

async function checkToken(req, res) {

    const userId = req.tokenId;

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        return res.send({ error: 'User not found' });
    }
    
    const timeSession = privilegedRoles.includes(user.role) ? "8h" : "2h";
    const tokenSession = await tokenSign(user, timeSession);
    return res.send({
        data: { message: "Update token" , id: user.id, fullName: fullName(user), email: user.email, role: user.role },
        tokenSession
    });
}

function fullName(user){
    return user.firstName + ' ' + user.lastName
}

module.exports = { loginCtrl, registerCtrl, checkToken }
