const mapPatientData = (data) => {
    return {
        firstName: data.firstName,
        lastName: data.lastName,
        age: ageBirth(data.birthDate) + ' años',
        numberDocument: data.numberDocument,
        typeDocument: data.typeDocument,
        sex: data.sex,
        rol: data.User.rol,
        email: data.User.email,
        userId: data.User.id,
        planOSName: data.User.Patient.PlanOS.name,
        socialWork: data.User.Patient.PlanOS.SocialWork.name
    };
}; 

function ageBirth(birthDate) {
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    return age;
}

module.exports = { mapPatientData}