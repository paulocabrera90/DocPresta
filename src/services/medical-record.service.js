const { Prescription, Benefit, Section, Patient, PlanOS, SocialWork, User, Person, Sickness, Profesional, Speciality, Profesion } =  require('../models/index.models');

async function getAllMedicalRecordsService(userId) {
    try{
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
                    required:true,
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
                    required: true,
                    where: { userId: userId },
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
            where: {userId},
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

        var speciality = null;
        var profesion = null;
        if (profesional) {
            speciality = profesional.dataValues.Speciality.dataValues;
        
            profesion = speciality && speciality.profesionId
            ? await Profesion.findOne({ where: { id: speciality.profesionId } })
            : null;

            speciality = profesional.dataValues.Speciality.dataValues;
        
            profesion = speciality && speciality.profesionId
            ? await Profesion.findOne({ where: { id: speciality.profesionId } })
            : null;
        }

        
    
        return { medicalRecords, profesional, speciality, profesion };
    } catch (error) {
        throw error;
    }
    
}

module.exports = { getAllMedicalRecordsService }