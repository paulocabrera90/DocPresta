const { where } = require('sequelize');
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

async function getPatientByDniService(dni) {
    return Patient.findOne({ 
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
                    where: { numberDocument: dni }
                }
            }
        ]
    });
}

async function getListAllPatientsService() {
    return Patient.findAll({ 
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

async function updatePatientService(patientId, data) {
    const transaction = await sequelize.transaction();
    try {
        const { firstName, lastName, birthDate, numberDocument, typeDocument, sex, planOSId, passwordhash, username, email } = data;
        
        const patient = await Patient.findByPk(patientId, {
            include: {
                model: User,
                as: 'User',
                include: {
                    model: Person,
                    as: 'Person'
                }
            },
            transaction
        });

        if (!patient) {
            throw new Error('Paciente no encontrado.');
        }

        const person = patient.User.Person;
        
        // Actualiza los datos de la persona
        await Person.update({
            firstName, lastName, birthDate, numberDocument, typeDocument, sex, ModificationDate: new Date()
        }, {
            where: { id: person.id },
            transaction
        });

        // Si hay cambio de contraseña, se encripta la nueva contraseña
        if (passwordhash) {
            const passwordEncrypted = await encrypt(passwordhash);
            await User.update({
                username, email, hashPassword: passwordEncrypted, modificationDate: new Date()
            }, {
                where: { id: patient.userId },
                transaction
            });
        } else {
            // Actualiza los datos del usuario sin cambiar la contraseña
            await User.update({
                username, email, modificationDate: new Date()
            }, {
                where: { id: patient.userId },
                transaction
            });
        }
        
        // Actualiza los datos del paciente
        await Patient.update({
            planOSId, modificationDate: new Date()
        }, {
            where: { id: patientId },
            transaction
        });

        await transaction.commit();
        return { message: "Paciente actualizado con éxito." };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function deletePatientService(patientId) {
    const transaction = await sequelize.transaction();
    try {
        // Encuentra el paciente y su usuario asociado
        const patient = await Patient.findByPk(patientId, {
            include: {
                model: User,
                as: 'User'
            },
            transaction
        });

        if (!patient) {
            throw new Error('Paciente no encontrado.');
        }

        // Elimina registros de prescripciones relacionados si existen
        await Prescription.destroy({
            where: { patientId: patientId },
            transaction
        });

        // Elimina el usuario asociado y la persona relacionada
        if (patient.User) {
            await Person.destroy({
                where: { id: patient.User.personId },
                transaction
            });
            await User.destroy({
                where: { id: patient.User.id },
                transaction
            });
        }

        // Finalmente, elimina el paciente
        await Patient.destroy({
            where: { id: patientId },
            transaction
        });

        await transaction.commit();
        return { message: "Paciente eliminado con éxito." };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}



module.exports = {
    getPatientByIdService,
    createPatientService,
    getListAllPatientsService,
    getPatientByDniService,
    updatePatientService,
    deletePatientService
};