
const { loginError } = require('../helpers/handleError');
const { User, Person } = require('../models/index.models');
const storage = require('../storage/session');
const { tokenSign } = require('../utils/generateToken');
const { compare } = require('../utils/handleBcrypt');

async function login(email, password) {
    try {
        console.log("LOGIN SERVICE!")
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
            throw new loginError(422, 'CREDENTIALS_INCORRECT', 'Credenciales incorrectas');
        }
        
        const checkPassword = await compare(password, user.hashPassword);
    
        if (!checkPassword) {
            throw new loginError(422, 'CREDENTIALS_INCORRECT', 'Credenciales incorrectas');
        }
    
        const tokenSession = await tokenSign(user);
    
        await storage.setState({
            token: tokenSession,
            user:user.dataValues
        })
    
        return {
            id: user.id,
            fullName: fullName(user),
            email: user.email,
            rol: user.rol,
            tokenSession
        };
    } catch (error) {
        throw error;
    }
    
}

function fullName(user){
    return user.Person.firstName + ' ' + user.Person.lastName
}

module.exports = {
    login
};
