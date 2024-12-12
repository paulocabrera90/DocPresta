
const { loginError } = require('../helpers/handleError');
const { User, Person, Patient, Profesional} = require('../models/index.models');
const storage = require('../storage/session');
const { hasPassedThreshold } = require('../utils/expirationDateProfesional');
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
                },
                {
                    model: Patient,
                    as: 'Patient'
                },
                {
                    model: Profesional,
                    as: 'Profesionals'
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

        if(user.rol==='PROFESIONAL' && hasPassedThreshold(user.Profesionals.creationDate)){
            throw new loginError(422, 'CREDENTIALS_INCORRECT', 'Su cuenta como profesional está caducada. Por favor, contacte al administrador para renovar su registro o actualizar su información.');
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
