const mapPatientData = (data) => {
    console.log("DATA PATIENT", data)
    return {        
        id: data.id,
        firstName: data.User.Person.firstName,
        lastName: data.User.Person.lastName,
        age: ageBirth(data.User.Person.birthDate) + ' años',
        birthDate: data.User.Person.birthDate,
        numberDocument: data.User.Person.numberDocument,
        typeDocument: data.User.Person.typeDocument,
        sex: data.User.Person.sex,
        patientId: data.id,
        rol: data.User.rol,
        email: data.User.email,
        userId: data.User.id,
        planOSName: data.PlanOS.name,
        planOSId: data.PlanOS.id,
        socialWorkName: data.PlanOS.SocialWork.name,
        socialWorkId: data.PlanOS.SocialWork.id
    };
}; 


function ageBirth(birthDate) {
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    return age;
}

module.exports = { mapPatientData }