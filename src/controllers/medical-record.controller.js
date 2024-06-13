const { Profesional, Speciality,Benefit, Section ,Person, Profesion, Prescription , Patient, PlanOS, SocialWork, Sickness, User} = require('../models/index.models');
const { httpError } = require('../helpers/handleError');
const { where } = require('sequelize');
const storage = require('../storage/session');
async function medicalRecordNew(req, res){   
    try {
        const medicalRecord  = await Prescription.findAll({
            include: [
                {
                    model: Benefit,
                    as: 'Benefits'
                },
                {
                    model: Patient,
                    as: 'Patients'
                },
                {
                    model: Sickness,
                    as: 'Sicknesses'
                },
                {
                    model: Profesional,
                    as: 'Profesionals'
                }
            ]
        })

        const profesional = await Profesional.findOne({
            where: {userId: storage.state.user.id},
            include: [
                {
                    model: Speciality,
                    as: 'Speciality'
                }
            ]
        })
    
        const speciality = profesional.dataValues.Speciality.dataValues;
        const profesion = await Profesion.findOne({ where: { id: speciality.profesionId } })
    
        // res.render('medical-record-new', { 
        //     medicalRecord,
        //     person: storage.state.user.Person,
        //     profesional: profesional.dataValues,
        //     speciality,
        //     profesion:profesion.dataValues
        // })

        res.json({ 
            medicalRecord,
            person: storage.state.user.Person,
            profesional: profesional.dataValues,
            speciality,
            profesion:profesion.dataValues
        })
    } catch (error) {
        httpError(res, error);
    }
    
}

async function getListAllMedicalRecord(req, res){
    try {
        const medicalRecords  = await Prescription.findAll({
            include: [
                {
                    model: Benefit,
                    as: 'Benefits',
                    include: [
                        {
                            model: Section,
                            as: 'Sections'
                        }
                    ]
                },
                {
                    model: Patient,
                    as: 'Patients',
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
                },
                {
                    model: Sickness,
                    as: 'Sicknesses'
                },
                {
                    model: Profesional,
                    as: 'Profesionals',
                    where: { userId: storage.state.user.id },
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
                }
            ]
        })

        const profesional = await Profesional.findOne({
            where: {userId: storage.state.user.id},
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
        })
    
        const speciality = profesional.dataValues.Speciality.dataValues;
        const profesion = await Profesion.findOne({ where: { id: speciality.profesionId } })

        res.render('medical-record-landing', {
            medicalRecords,
            speciality,
            profesion , 
            profesional
        });
        // res.json({ medicalRecords, speciality, profesion, profesional });
    } catch (error) {
        httpError(res, error);
    }
}

module.exports= { 
    medicalRecordNew,
    getListAllMedicalRecord
}