
const { User } = require('../models/index.models')
const { tokenSign } = require('../utils/generateToken');
const { compare } = require('../utils/handleBcrypt');

const privilegedRoles = ["admin"];

async function login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
        throw new Error('Invalid password');
    }

    const timeSession = privilegedRoles.includes(user.role) ? "8h" : "2h";
    const tokenSession = await tokenSign(user, timeSession);

    return {
        id: user.id,
        fullName: fullName(user),
        email: user.email,
        role: user.role,
        tokenSession
    };
}

function fullName(user){
    return user.firstName + ' ' + user.lastName
}

module.exports = {
    login
};
