const { httpError } = require('../helpers/handleError');
const { Profesional, Speciality, User, Person, sequelize, Profesion, Prescription } = require('../models/index.models');
const { mapProfesionalData } = require('../models/mappers/profesional.mapper');
const { encrypt } = require('../utils/handleBcrypt');


async function getListAllProfesional(req, res){
    try {
        
        const profesional = await Profesional.findAll({
            include: [
                {
                    model: Speciality,
                    as: 'Speciality',
                    include: {
                        model: Profesion,
                        as: 'Profesion'
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

        const listMapProfesional = profesional.map(mapProfesionalData);

        // if (hasPassedThreshold()) {
        //     return res.status(404).json({ message: 'El profesional' });
        // }    

        res.render('profesional-landing', { profesionals: listMapProfesional });       

    } catch(error) {
        httpError(res, error);
    }
}

async function getProfesionalById(req, res){
    const { id } = req.params;
    try {
        const profesional = await Profesional.findOne({
            where: { id },
            include: [
                {
                    model: Speciality,
                    as: 'Speciality',
                    include: {
                        model: Profesion,
                        as: 'Profesion'
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

        if (!profesional || !profesional.User || !profesional.User.Person) {
            return res.status(404).json({ message: 'Profesional no encontrado' });
        }
        // res.json({
        //     profes:mapProfesionalData(profesional), 
        //     profesions: await Profesion.findAll(), 
        //     specialities: await Speciality.findAll()
        // }); 

        if (!profesional) {
            return res.render('profesional-new', { 
                profesional: '',
                profesions: await Profesion.findAll(), 
                specialities: await Speciality.findAll()
            });
        }

        const mapProfesional = mapProfesionalData(profesional);

        res.render('profesional-new', { 
            profesional: mapProfesional, 
            profesions: await Profesion.findAll(), 
            specialities: await Speciality.findAll() 
        });

    } catch(error) {
        httpError(res, error);
    }
}

async function getProfesionalByUserId(req, res){
    const { id } = req.params;
    try {
        const profesional = await Profesional.findOne({
            where: { userId: id },
            include: [
                {
                    model: Speciality,
                    as: 'Speciality',
                    include: {
                        model: Profesion,
                        as: 'Profesion'
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

        if (!profesional || !profesional.User || !profesional.User.Person) {
            return res.status(404).json({ message: 'Profesional no encontrado' });
        }

        if (!profesional) {
            return res.render('profesional-new', { 
                profesional: '',
                profesions: await Profesion.findAll(), 
                specialities: await Speciality.findAll()
            });
        }

        const mapProfesional = mapProfesionalData(profesional);

        res.render('profesional-new', { 
            profesional: mapProfesional, 
            profesions: await Profesion.findAll(), 
            specialities: await Speciality.findAll() 
        });

    } catch(error) {
        httpError(res, error);
    }
}

async function newProfesional(req, res) {
    try {
        return res.render('profesional-new', { 
            profesions: await Profesion.findAll(), 
            specialities: await Speciality.findAll()
        });
        
    } catch (error) {
        httpError(res, error);
    }
}

async function createProfesional(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const {firstName, lastName, birthDate, numberDocument, typeDocument, sex,
            legalAddress, registrationNumber, idREFEPS, specialityId, passwordhash, 
            username, email
        } = req.body;
        console.log("req.body create", req.body)

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

        const encryptedPassword = await encrypt(passwordhash);

        const registerUser = await User.create({
            username,
            email,          
            hashPassword: encryptedPassword,          
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
        console.log("Create professional successfully")
        res.status(200).json({message: "Profesional creado correctamente"});
    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function deleteProfesional(req, res) {
    const { id } = req.params; 
    const transaction = await sequelize.transaction();

    try {

        console.log("req.params delete :", id);

        const existingProfesional = await Profesional.findOne({
            where: { id },
            transaction            
        });        

        if (!existingProfesional) {
            throw new Error('Profesional no encontrado');
        }

        const existingPrescription = await Prescription.findOne({
            where: { profesionalId: existingProfesional.id },
            transaction            
        });

        if (existingPrescription) {
            throw new Error('Profesional tiene asociado prescripciones.');
        }

        const existingUser = await User.findOne({
            where: { id: existingProfesional.userId }
        }, { transaction });

        if (!existingUser) {
            throw new Error('Usuario no encontrado');
        }

        const existingPerson = await Person.findOne({
            where: { id: existingUser.personId }
        }, { transaction });

        if (!existingPerson) {
            throw new Error('Person not found');
        }
        
        await Profesional.destroy({
            where: { id },
            transaction
        });

        await User.destroy( {
            where: { id: existingUser.id },
            transaction
        });

        await Person.destroy( {
            where: { id: existingPerson.id , numberDocument: existingPerson.numberDocument},
            transaction
        });

        await transaction.commit();
        
        res.json( {id} );
    } catch (error) {
       
        await transaction.rollback();
        httpError(res, error);
    }
}

async function updateProfesional(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const {id} = req.params;
        const {
            firstName, lastName, birthDate, numberDocument, typeDocument, sex,
            legalAddress, registrationNumber, idREFEPS, specialityId, 
            username, email, passwordHash
        } = req.body;

        console.log("req.body update", req.body);

        const existingProfesional = await Profesional.findOne({
            where: { id }
        }, { transaction });

        if (!existingProfesional) {
            throw new Error('Profesional not found');
        }

        const existingUser = await User.findOne({
            where: { id: existingProfesional.userId }
        }, { transaction });

        if (!existingUser) {
            throw new Error('User not found');
        }

       // const hashPassword = passwordHash ? await encrypt(passwordHash) : existingUser.hashPassword;

        await User.update({
            username,
            email,
            modificationDate: Date.now(),
        }, {
            where: { id: existingUser.id },
            transaction
        });

        const existingPerson = await Person.findOne({
            where: { id: existingUser.personId }
        }, { transaction });

        if (!existingPerson) {
            throw new Error('Person not found');
        }

        await Person.update({
            firstName,
            lastName,
            birthDate,
            numberDocument,
            typeDocument,
            sex,
            modificationDate: Date.now(),
        }, {
            where: { id: existingPerson.id , numberDocument: existingPerson.numberDocument},
            transaction
        });       

        await Profesional.update({
            legalAddress,
            registrationNumber,
            idREFEPS,
            specialityId,
            modificationDate: Date.now(),
        }, {
            where: { userId: existingUser.id, id },
            transaction
        });

        await transaction.commit();
        console.log("Updated for professional successfully")
        res.json({message: "Updated for professional successfully"});

    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

module.exports= { 
    getListAllProfesional,
    createProfesional,
    newProfesional,
    deleteProfesional,
    getProfesionalById,
    updateProfesional,
    getProfesionalByUserId
}