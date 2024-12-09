const { Prescription, PrescriptionBenefits, Medicine, Benefit, ConcentratedMedicine, QuantityMed, Section, Patient, PlanOS, SocialWork, User, PharmaForm, ComercialMedicine, FamilyMedicine, Person, Sickness, Profesional, Speciality, Profesion, sequelize } =  require('../models/index.models');
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
                name: prescriptionData['enfermedad-code'], 
                code: prescriptionData['enfermedad-code'],
                description: prescriptionData['enfermedad-code'],
                treatment: prescriptionData['enfermedad-code'],
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

module.exports = { 
    getAllMedicalRecordsService,
    createMedicalRecordService }