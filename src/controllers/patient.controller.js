const { Patient, User, Person, PlanOS, SocialWork, Profesional } = require('../models/index.models');
const { mapPatientData } = require('../models/mappers/patient.mapper');
const { httpError } = require('../helpers/handleError');

async function getPatient (req, res) {
    try {
        const dni = req.params.dni;
        const patient = await Person.findOne({ 
            where: { numberDocument: dni },
            include: {
                model: User,
                as: 'User',
                where: { rol: 'PACIENTE' },
                include: {
                    model: Patient,
                    as: 'Patient',
                    include: {
                        model: PlanOS,
                        as: 'PlanOS',
                        include: {
                            model: SocialWork,
                            as: 'SocialWork',
                        }
                    }
                }
            }
         });

        if (!patient || !patient.User || !patient.User.Patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        const mappedData = mapPatientData(patient);
        
        console.log("patient", patient.User.Patient);
        res.status(200).json({ data: mappedData}) ;
        //res.render("medical-record-new",{ patient: mappedData});
    } catch (error) {
        res.status(500).json({ error: 'Error to get patient: ' + error });
    }
}

async function getListAllPatients(req, res){
    try {
        const patient = await Patient.findAll({
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

        console.log(patient);
        const listMapPatient = patient.map(mapPatientData);

        res.render('patient-landing', { 
            patients: listMapPatient
         });       
        //res.json({data:listMapPatient})

    } catch(error) {
        httpError(res, error);
    }
}

async function newPatient(req, res) {
    try {
        return res.render('patient-new', { 
            planesOS: await Patient.findAll(),
            socialsWork: await SocialWork.findAll()
        });
        
    } catch (error) {
        httpError(res, error);
    }
}


async function createPatient(req, res) {
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


async function deletePatient(req, res) {
    const { id } = req.params; 
    const transaction = await sequelize.transaction();

    try {
        
        await Profesional.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();
        
        res.json( {id} );
    } catch (error) {
       
        await transaction.rollback();
        httpError(res, error);
    }
}

module.exports = { getPatient, getListAllPatients, newPatient, createPatient, deletePatient}