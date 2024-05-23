const { tokenSign } = require("../utils/generateToken");
const { encrypt } = require("../utils/handleBcrypt");
const authService = require('../services/authorization.service');
const { User } = require('../models/index.models');
const { httpError } = require("../helpers/handleError"); 
const storage  = require("handy-storage");
//const storage = require('handy-storage');

const privilegedRoles = ["admin"];

async function loginCtrl(req, res) {
    try {
        const { email, password } = req.body;
        const userData = await authService.login(email, password);
        console.log("userData", userData)

        res.header('Authorization', `Bearer ${userData.tokenSession}`);
        //res.status(200).render('home', { data: userData });
        res.json({ userData });
        
    } catch (error) {        
            httpError(res, error);        
    }
}

async function registerCtrl(req, res) {
    try {
        
        const {   
            firstName,          
            lastName,          
            email,          
            password,          
            profilePic,          
            role  
        } = req.body

        const passwordHash = await encrypt(password)
        const registerUser = await User.create({
            firstName,          
            lastName,          
            email,          
            password: passwordHash,          
            profilePic,          
            role 
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
