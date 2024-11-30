const { Patient, User, Person, PlanOS, SocialWork, sequelize } = require('../models/index.models');
const { mapPatientData } = require('../models/mappers/patient.mapper');
const { httpError } = require('../helpers/handleError');
const { getPatientByIdService, getListAllPatientsService, createPatientService, getPatientByDniService } = require('../services/patient.service');

async function getPatientById (req, res) {
    const { id } = req.params;
    try {
        const patient = await getPatientByIdService(id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        //res.json({data: mapPatientData(patient)})
        if (!patient) {
            return res.render('patient-new', { 
                patient: '',
                plansOS: await PlanOS.findAll(),
                socialsWork: await SocialWork.findAll()
            });
        }

        const mapPatient = mapPatientData(patient);

        res.render('patient-new', { 
            patient: mapPatient, 
            plansOS: await PlanOS.findAll(),
            socialsWork: await SocialWork.findAll()
        });
    } catch (error) {
        httpError(res, error);
    }
}

async function getPatientByDni (req, res) {
    const { dni } = req.params;
    console.log("DNI", dni)
    try {
        const patient = await getPatientByDniService(dni);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }    
        
       // const mapPatient = mapPatientData(patient);

        res.json({patient})
    } catch (error) {
        httpError(res, error);
    }
}

async function getListAllPatients(req, res){
    try {
        const patient = await getListAllPatientsService();
        
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
            plansOS: await PlanOS.findAll(),
            socialsWork: await SocialWork.findAll()
        });
        
    } catch (error) {
        httpError(res, error);
    }
}

async function createPatient(req, res) {
    const transaction = await sequelize.transaction();
    try {
        
        console.log("Create patient: ", req.body)
        const patient = await createPatientService(req.body);
        console.log("Create patient successfully")
        res.status(200).json({message: "Create patient successfully", patient});

    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function updatePatient(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const {id} = req.params;
        const {
            firstName, lastName, birthDate, numberDocument, 
            typeDocument, sex, planOSId, username, email
        } = req.body;

        console.log("req.body update", req.body);

        const existingPatient = await Patient.findOne({
            where: { id }
        }, { transaction });

        if (!existingPatient) {
            throw new Error('Patient not found');
        }

        const existingUser = await User.findOne({
            where: { id: existingPatient.userId }
        }, { transaction });

        if (!existingUser) {
            throw new Error('User not found');
        }

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

        await Patient.update({
            planOSId,
            modificationDate: Date.now(),
        }, {
            where: { userId: existingUser.id, id },
            transaction
        });

        await transaction.commit();
        console.log("Updated for patient successfully")
        res.json({message: "Updated for patient successfully"});

    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function deletePatient(req, res) {
    const { id } = req.params; 
    const transaction = await sequelize.transaction();

    try {   
        // const existingPatient = await getPatientByIdService(id);

        // await Patient.destroy({
        //     where: { id },
        //     transaction
        // });

        // await transaction.commit();
        const existingPatient = await Patient.findByPk(id, {
            include: [{
                model: User,
                as: 'User',
                include: [{
                    model: Person,
                    as: 'Person'
                }]
            }],
            transaction
        });
        
        await existingPatient.destroy({ transaction });
        await existingPatient.User.destroy({ transaction });
        await existingPatient.User.Person.destroy({ transaction });
        await transaction.commit();
        
        res.status(200).json( {id, existingPatient} );
    } catch (error) {
       
        await transaction.rollback();
        httpError(res, error);
    }
}

module.exports = { 
    getPatientById, 
    getListAllPatients, 
    newPatient, 
    createPatient, 
    deletePatient, 
    updatePatient, 
    getPatientByDni
}