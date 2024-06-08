const mapProfesionalData = (originalObject) => {
    return {
        id: originalObject.id,
        legalAddress: originalObject.legalAddress,
        registrationNumber: originalObject.registrationNumber,
        idREFEPS: originalObject.idREFEPS,
        profesionName: originalObject.Speciality.Profesion.name,
        profesionCode: originalObject.Speciality.Profesion.code,
        profesionDescription: originalObject.Speciality.Profesion.description,
        nameSpeciality: originalObject.Speciality.name,
        codeSpeciality: originalObject.Speciality.code,
        descriptionSpeciality: originalObject.Speciality.description,
        firstName: originalObject.User.Person.firstName,
        lastName: originalObject.User.Person.lastName,
        birthDate: originalObject.User.Person.birthDate, 
        numberDocument: originalObject.User.Person.numberDocument,
        typeDocument: originalObject.User.Person.typeDocument,
        sex: originalObject.User.Person.sex,
        email: originalObject.User.email,
        username: originalObject.User.username,
        userRole: originalObject.User.rol,
        profesionId: originalObject.Speciality.profesionId,
        specialityId: originalObject.specialityId
    };
};

module.exports = { mapProfesionalData }