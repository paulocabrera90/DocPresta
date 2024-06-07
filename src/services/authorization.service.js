
const { User, Person } = require('../models/index.models');
const storage = require('../storage/session');
const { tokenSign } = require('../utils/generateToken');
const { compare } = require('../utils/handleBcrypt');

const privilegedRoles = ["admin"];
async function login(email, password) {
    const user = await User.findOne({ 
        where: { email },
        include: [
            {
                model: Person,
                as: 'Person'
            }
        ]
    });

    if (!user) {
        throw new Error('User not found');
    }
    
    const checkPassword = await compare(password, user.hashPassword);

    if (!checkPassword) {
        throw new Error('Invalid password');
    }

    const timeSession = privilegedRoles.includes(user.role) ? "8h" : "2h";
    const tokenSession = await tokenSign(user, timeSession);

    await storage.setState({
        token: tokenSession,
        user:user.dataValues
    })

    return {
        id: user.id,
        fullName: user.username,
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
