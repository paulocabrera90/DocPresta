const { httpError } = require('../helpers/handleError');
const { Profesional, Speciality, User, Person, sequelize } = require('../models/index.models');
const { mapProfesionalData } = require('../models/mappers/profesional.mapper');
const { encrypt } = require('../utils/handleBcrypt');

async function getListAllProfesional(req, res){
    try {
        const profesional = await Profesional.findAll({
            include: [
                {
                    model: Speciality,
                    as: 'Speciality'
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

        const listMapProfesional = profesional.map(mapProfesionalData);

        res.render('profesional-landing', { profesionals: listMapProfesional });

       // res.json(profesional.map(mapProfesionalData));

    } catch(error) {
        httpError(res, error);
    }
}

async function createProfesional(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const {firstName, lastName, birthDate, numberDocument, typeDocument, sex,
            legalAddress, registrationNumber, idREFEPS, specialityId, passwordHash, 
            username, email
        } = req.body;

        // Crear la nuevo Person
        const newPerson = await Person.create({
            firstName,
            lastName,
            birthDate,
            numberDocument,
            typeDocument,
            sex,
            state: true,
            creationDate: new Date(),
            ModificationDate: new Date()
        }, { transaction });

        const password = await encrypt(passwordHash)

        const registerUser = await User.create({
            username,
            email,          
            hashPassword: password,          
            profilePic: '',
            state: true,
            crationDate: Date.now(),
            modificationDate: Date.now(),
            rol: "PROFESIONAL",
            personId: newPerson.id
        }, { transaction })

        const newProfesional = await Profesional.create({
            legalAddress,
            registrationNumber,
            idREFEPS,
            userId: registerUser.id,
            specialityId, 
            creationDate: new Date(),
            modificationDate: new Date()
        }, { transaction });

        await transaction.commit();
        //res.redirect('/profesionales');
        res.status(201).json(newProfesional);
    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

module.exports= { 
    getListAllProfesional,
    createProfesional
}