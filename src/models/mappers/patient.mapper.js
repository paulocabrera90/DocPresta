const mapPatientData = (data) => {
    return {
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        numberDocument: data.numberDocument,
        typeDocument: data.typeDocument,
        sex: data.sex,
        rol: data.User.rol,
        email: data.User.email,
        userId: data.User.id,
        planOSId: data.User.Patient.planOSId,
        statePatient: data.User.Patient.state
    };
};

module.exports = { mapPatientData}