const { Patient, User, Person, PlanOS, SocialWork, sequelize } = require('../models/index.models');
const { encrypt } = require('../utils/handleBcrypt');

async function getPatientByIdService(id) {
    return Patient.findOne({ 
        where: { id },
        include: [
            {
                model: PlanOS,
                as: 'PlanOS',
                include: {
                    model: SocialWork,
                    as: 'SocialWork'
                }
            },
            {
                model: User,
                as: 'User',
                include: {
                    model: Person,
                    as: 'Person',
                }
            }
        ]
    });
}

async function getListAllPatientsService(id) {
    return Patient.findOne({ 
        where: { id },
        include: [
            {
                model: PlanOS,
                as: 'PlanOS',
                include: {
                    model: SocialWork,
                    as: 'SocialWork'
                }
            },
            {
                model: User,
                as: 'User',
                include: {
                    model: Person,
                    as: 'Person',
                }
            }
        ]
    });
}

async function createPatientService(data) {
    const transaction = await sequelize.transaction();
    try {
        const { firstName, lastName, birthDate, numberDocument, typeDocument, sex, planOSId, passwordhash, username, email } = data;
        
        const newPerson = await Person.create({
            firstName, lastName, birthDate, numberDocument, typeDocument, sex, state: true, creationDate: new Date(), ModificationDate: new Date()
        }, { transaction });

        const passwordEncrypted = await encrypt(passwordhash);

        const registerUser = await User.create({
            username, email, hashPassword: passwordEncrypted, profilePic: '', state: true, crationDate: Date.now(), modificationDate: Date.now(), rol: "PACIENTE", personId: newPerson.id
        }, { transaction });

        const patient = await Patient.create({
            userId: registerUser.id, planOSId, creationDate: new Date(), modificationDate: new Date()
        }, { transaction });

        await transaction.commit();
        return patient;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    getPatientByIdService,
    createPatientService,
    getListAllPatientsService
};