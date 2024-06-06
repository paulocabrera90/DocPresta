const { httpError } = require('../helpers/handleError');
const { Profesional, Speciality, User, Person, sequelize, Profesion } = require('../models/index.models');
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

    } catch(error) {
        httpError(res, error);
    }
}

async function newProfesional(req, res) {
    try {
        const profesions = await Profesion.findAll();
        const specialities = await Speciality.findAll();
        res.json('profesional-new',{ specialities, profesions });
        
    } catch (error) {
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
        console.log("req.body", req.body)

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
        res.redirect('/api/profesionals');
    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function deleteProfesional(req, res) {
    const { id } = req.params; 
    const transaction = await sequelize.transaction();

    try {
        
        await Profesional.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();
        
        res.redirect('/api/profesionals');
    } catch (error) {
       
        await transaction.rollback();
        httpError(res, error);
    }
}

module.exports= { 
    getListAllProfesional,
    createProfesional,
    newProfesional,
    deleteProfesional
}