const { Prescription, Medicine, Benefit, ConcentratedMedicine, QuantityMed, Section, Patient, PlanOS, SocialWork, User, PharmaForm, ComercialMedicine, FamilyMedicine, Person, Sickness, Profesional, Speciality, Profesion, sequelize } =  require('../models/index.models');
const { getPatientByDniService } = require('./patient.service');

async function getAllMedicalRecordsService(userId) {
    try{
        const medicalRecords  = await Prescription.findAll({
            include: [
                {
                    model: Benefit,
                    as: 'Benefits',
                    through: { attributes: [] }, 
                    include: [{
                        model: Section,
                        as: 'Sections'
                    }]
                },
                {   
                    model: Medicine,
                    include: [
                        { model: ConcentratedMedicine, as: 'ConcentratedMedicines' },
                        { model: QuantityMed, as: 'QuantityMeds' },
                        { model: PharmaForm, as: 'PharmaForms' },
                        { model: ComercialMedicine, as: 'ComercialMedicines' },
                        { model: FamilyMedicine, as: 'FamilyMedicines' }
                    ],
                    through: { attributes: [] },
                    as: 'Medicines'
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

async function getAllMedicalRecordsByPatientIdService(patientId) {
    try{
        const medicalRecords  = await Prescription.findAll({
            where: { patientId: patientId },
            include: [
                {
                    model: Benefit,
                    as: 'Benefits',
                    through: { attributes: [] }, 
                    include: [{
                        model: Section,
                        as: 'Sections'
                    }]
                },
                {   
                    model: Medicine,
                    include: [
                        { model: ConcentratedMedicine, as: 'ConcentratedMedicines' },
                        { model: QuantityMed, as: 'QuantityMeds' },
                        { model: PharmaForm, as: 'PharmaForms' },
                        { model: ComercialMedicine, as: 'ComercialMedicines' },
                        { model: FamilyMedicine, as: 'FamilyMedicines' }
                    ],
                    through: { attributes: [] },
                    as: 'Medicines'
                },
                {
                    model: Patient,
                    as: 'Patients',
                    required:true,
                    where: { state: true },
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
    
        return { medicalRecords, profesional:'', speciality:'', profesion:'' };
    } catch (error) {
        throw error;
    }
    
}

async function getMedicalRecordByIdService(recordId, userId) {
    try {
        const medicalRecord = await Prescription.findOne({
            where: { id: recordId },
            include: [
                {
                    model: Benefit,
                    as: 'Benefits',
                    through: { attributes: [] },
                    include: [{
                        model: Section,
                        as: 'Sections'
                    }]
                },
                {   
                    model: Medicine,
                    include: [
                        { model: ConcentratedMedicine, as: 'ConcentratedMedicines' },
                        { model: QuantityMed, as: 'QuantityMeds' },
                        { model: PharmaForm, as: 'PharmaForms' },
                        { model: ComercialMedicine, as: 'ComercialMedicines' },
                        { model: FamilyMedicine, as: 'FamilyMedicines' }
                    ],
                    through: { attributes: [] },
                    as: 'Medicines'
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
                            attributes: { exclude: ['hashPassword'] }, 
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
                }
            ]
        });

        if (!medicalRecord) {
            throw new Error('Registro médico no encontrado.');
        }

        return medicalRecord;
    } catch (error) {
        throw error;
    }
}

async function createMedicalRecordService(medicalRecordData){

    const transaction = await sequelize.transaction();
    try {
        // Crear el registro médico
        const { benefits, medications, ...prescriptionData } = medicalRecordData;

        var sickness = await Sickness.findOne({
            where: { name: prescriptionData['enfermedad-nombre'],
                code: prescriptionData['enfermedad-code']
             }
        })

        if(!sickness){
            sickness = await Sickness.create({
                name: prescriptionData['enfermedad-nombre'], 
                code: prescriptionData['enfermedad-code'],
                description: prescriptionData['diagnostico'],
                treatment: prescriptionData['tratamiento'],
                creationDate: new Date(), 
                ModificationDate: new Date()
            }, { transaction });
        }

        let parts = prescriptionData['patientList'].split('-');
        let documentPart = parts.length > 1 ? parts[1].trim() : null;

        const patient = await getPatientByDniService(documentPart);

        if(!patient){
            throw new Error('Paciente no encontrado.');
        }

        const prescription = await Prescription.create({
            validate: prescriptionData['vigencia'],
            observation: prescriptionData['observation'],
            profesionalId: prescriptionData['profesionalId'],
            sicknessId: sickness.id,
            patientId: patient.id,
            prescriptionDate: new Date(prescriptionData['fecha_prescripcion']),
            benefitDescription: prescriptionData['benefitDescription']
        }, { transaction });


        if (benefits && benefits.length > 0) {
            await prescription.addBenefits(benefits, { transaction });
        }

        if (medications && medications.length > 0) {
            await prescription.addMedicines(medications, { transaction });
        }

        await transaction.commit();
        return prescription;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }

}

async function updateMedicalRecordService(prescriptionId, medicalRecordData) {
    const transaction = await sequelize.transaction();
    try {
        const { benefits, medications, ...prescriptionData } = medicalRecordData;

        let sickness = await Sickness.findOne({
            where: {
                name: prescriptionData['enfermedad-nombre'],
                code: prescriptionData['enfermedad-code']
            },
            transaction
        });

        if (!sickness) {
            sickness = await Sickness.create({
                name: prescriptionData['enfermedad-nombre'],
                code: prescriptionData['enfermedad-code'],
                description: prescriptionData['enfermedad-code'],
                treatment: prescriptionData['enfermedad-code'],
                creationDate: new Date(),
                modificationDate: new Date()
            }, { transaction });
        }

        let parts = prescriptionData['patientList'].split('-');
        let documentPart = parts.length > 1 ? parts[1].trim() : null;
        const patient = await getPatientByDniService(documentPart);

        if (!patient) {
            throw new Error('Paciente no encontrado.');
        }

        const prescription = await Prescription.findByPk(prescriptionId, { transaction });
        if (!prescription) {
            throw new Error('Prescripción no encontrada.');
        }

        await prescription.update({
            validate: prescriptionData['vigencia'],
            observation: prescriptionData['observation'],
            profesionalId: prescriptionData['profesionalId'],
            sicknessId: sickness.id,
            patientId: patient.id,
            prescriptionDate: new Date(prescriptionData['fecha_prescripcion']),
            benefitDescription: prescriptionData['benefitDescription']
        }, { 
            where: { prescriptionId },
            transaction 
        });

        const existingBenefits = await prescription.getBenefits({ transaction });
        await prescription.removeBenefits(existingBenefits, { transaction });
        if (benefits && benefits.length > 0) {
            await prescription.addBenefits(benefits, { transaction });
        }

        const existingMedicines = await prescription.getMedicines({ transaction });
        await prescription.removeMedicines(existingMedicines, { transaction });
        if (medications && medications.length > 0) {
            await prescription.addMedicines(medications, { transaction });
        }

        await transaction.commit();
        return prescription;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function deleteMedicalRecordService(recordId, userId) {
    const transaction = await sequelize.transaction();
    try {
        const prescription = await Prescription.findOne({
            where: { id: recordId, profesionalId: userId },
            transaction: transaction
        });

        if (!prescription) {
            throw new Error('Registro médico no encontrado o no tiene permiso para eliminarlo.');
        }

        await PrescriptionBenefit.destroy({
            where: { prescriptionId: recordId },
            transaction: transaction
        });

        await PrescriptionMedicine.destroy({
            where: { prescriptionId: recordId },
            transaction: transaction
        });

        await Prescription.destroy({
            where: { id: recordId },
            transaction: transaction
        });

        await transaction.commit();
        return { message: "Registro médico eliminado con éxito." };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}



module.exports = { 
    getAllMedicalRecordsService,
    createMedicalRecordService,
    updateMedicalRecordService,
    getMedicalRecordByIdService,
    deleteMedicalRecordService,
    getAllMedicalRecordsByPatientIdService
}