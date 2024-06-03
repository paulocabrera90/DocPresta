const mapProfesionalData = (originalObject) => {
    return {
        legalAddress: originalObject.legalAddress,
        registrationNumber: originalObject.registrationNumber,
        idREFEPS: originalObject.idREFEPS,
        name: originalObject.Speciality.name,
        code: originalObject.Speciality.code,
        description: originalObject.Speciality.description,
        firstName: originalObject.User.Person.firstName,
        lastName: originalObject.User.Person.lastName,
        birthDate: originalObject.User.Person.birthDate,
        numberDocument: originalObject.User.Person.numberDocument,
        typeDocument: originalObject.User.Person.typeDocument,
        sex: originalObject.User.Person.sex
    };
};

module.exports = { mapProfesionalData }