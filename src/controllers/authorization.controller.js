const { tokenSign } = require("../utils/generateToken")
const { compare, encrypt } = require("../utils/handleBcrypt")

const userModel = require('../models/user.models')
const { httpError } = require("../helpers/handleError")

const privilegedRoles = ["admin"];

async function loginCtrl(req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404);
            return res.send({ error: 'User not found' });
        }

        const checkPassword = await compare(password, user.password);

        const timeSession = privilegedRoles.includes(user.role) ? "8h" : "2h";
        const tokenSession = await tokenSign(user, timeSession);
        if (checkPassword) {
            return res.send({
                data: { id: user.id, fullName: fullName(user), email: user.email, role: user.role },
                tokenSession
            });
        }

        if (!checkPassword) {
            res.status(409)
            return res.send({
                error: 'Invalid password'
            });
        }
        
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
        const registerUser = await userModel.create({
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

    const user = await userModel.findById(userId);
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
