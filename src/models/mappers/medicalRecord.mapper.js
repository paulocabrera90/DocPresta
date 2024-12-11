const mapMedicalRecord = (medicalRecord) => {
    return {
        id: medicalRecord.id,
        prescriptionDate: medicalRecord.prescriptionDate,
        validate: medicalRecord.dataValues.validate,
        observation: medicalRecord.dataValues.observation,
        patientId: medicalRecord.patientId,
        sicknessId: medicalRecord.sicknessId,
        profesionalId: medicalRecord.profesionalId,
        profesional: {
            id: medicalRecord.profesionalId,
            name: medicalRecord.profesional ? `${medicalRecord.profesional.User.Person.firstName} ${medicalRecord.profesional.User.Person.lastName}` : '',
            registrationNumber: medicalRecord.profesional ? medicalRecord.profesional.registrationNumber : '',
            specialityName: medicalRecord.profesional && medicalRecord.profesional.Speciality ? medicalRecord.profesional.Speciality.name : '',
            specialityCode: medicalRecord.profesional && medicalRecord.profesional.Speciality ? medicalRecord.profesional.Speciality.code : '',
            profesionName: medicalRecord.profesional && medicalRecord.profesional.Speciality && medicalRecord.profesional.Speciality.Profesion ? medicalRecord.profesional.Speciality.Profesion.name : '',
            profesionDescription: medicalRecord.profesional && medicalRecord.profesional.Speciality && medicalRecord.profesional.Speciality.Profesion ? medicalRecord.profesional.Speciality.Profesion.description : ''
        },
        patient: {
            id: medicalRecord.Patients ? medicalRecord.Patients.User.Person.id : '',
            firstName: medicalRecord.Patients ? medicalRecord.Patients.User.Person.firstName : '',
            lastName: medicalRecord.Patients ? medicalRecord.Patients.User.Person.lastName : '',
            birthDate: medicalRecord.Patients ? medicalRecord.Patients.User.Person.birthDate : '',
            documentNumber: medicalRecord.Patients ? medicalRecord.Patients.User.Person.numberDocument : '',
            sex: medicalRecord.Patients ? medicalRecord.Patients.User.Person.sex : '',
            obraSocial: medicalRecord.Patients && medicalRecord.Patients.PlanOS ? medicalRecord.Patients.PlanOS.SocialWork.name : '',
            plan: medicalRecord.Patients && medicalRecord.Patients.PlanOS ? medicalRecord.Patients.PlanOS.name : ''
        },
        benefits: medicalRecord.Benefits ? medicalRecord.Benefits.map(benefit => ({
            id: benefit.id,
            name: benefit.name,
            code: benefit.code,
            description: benefit.description,
            justification: benefit.justification,
            sectionName: benefit.Sections ? benefit.Sections.name : '',
            sectionCode: benefit.Sections ? benefit.Sections.code : ''
        })) : [],
        medicines: medicalRecord.Medicines ? medicalRecord.Medicines.map(medicine => ({
            id: medicine.id,
            name: medicine.name,
            code: medicine.code,
            forms: medicine.PharmaForms ? medicine.PharmaForms.map(form => form.name) : [],
            concentrations: medicine.ConcentratedMedicines ? medicine.ConcentratedMedicines.map(cm => `${cm.quantity} ${cm.magnitude}`) : [],
            commercialNames: medicine.ComercialMedicines ? medicine.ComercialMedicines.map(com => com.name) : []
        })) : [],
        sickness: {
            id: medicalRecord.Sicknesses ? medicalRecord.Sicknesses.id : '',
            name: medicalRecord.Sicknesses ? medicalRecord.Sicknesses.name : '',
            description: medicalRecord.Sicknesses ? medicalRecord.Sicknesses.description : '',
            treatment: medicalRecord.Sicknesses ? medicalRecord.Sicknesses.treatment : '',
            code: medicalRecord.Sicknesses ? medicalRecord.Sicknesses.code : ''
        }
    };
};

module.exports = { mapMedicalRecord };
