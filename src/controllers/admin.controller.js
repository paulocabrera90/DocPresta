
const { mapPatientData } = require("../models/mappers/patient.mapper");
const { getListAllPatientsService } = require("../services/patient.service");
const storage = require("../storage/session");
const { Profesional, Speciality, User, Person, sequelize, Profesion, Prescription } = require('../models/index.models');
const { mapProfesionalData } = require('../models/mappers/profesional.mapper');

async function goAdmin (req, res){ 

    const patient = await getListAllPatientsService();
        
    console.log(patient);
    const listMapPatient = patient.map(mapPatientData);

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
    
    res.render('admin-landing', { 
        patients:listMapPatient,
        profesionals: listMapProfesional,
    });

    // res.json({ 
    //     patient:listMapPatient,
    //     profesional: listMapProfesional,
    // });
}

module.exports= { 
    goAdmin
}