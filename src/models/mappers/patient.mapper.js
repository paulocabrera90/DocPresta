const mapPatientData = (data) => {
    return {
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

// {
//     "id": 1,
//     "state": true,
//     "dateCreation": "2025-05-29T00:00:00.000Z",
//     "dateModification": "2025-05-29T00:00:00.000Z",
//     "userId": 2,
//     "planOSId": 11,
//     "PlanOS": {
//         "id": 11,
//         "name": "310",
//         "state": true,
//         "creationDate": "2024-05-29T05:49:54.000Z",
//         "modificationDate": "2024-05-29T05:49:54.000Z",
//         "socialWorkId": 1,
//         "SocialWork": {
//             "id": 1,
//             "name": "Osde",
//             "CUIT": "30-12345678-1",
//             "code": "001",
//             "status": true,
//             "creationDate": "2024-05-29T05:35:49.000Z",
//             "modificationDate": "2024-05-29T05:35:49.000Z"
//         }
//     },
//     "User": {
//         "id": 2,
//         "username": "marial",
//         "hashPassword": "$2a$10$Ap9SF4uShR.YiHsVqHVIHOx1AaPXxGiAHeyJ1R4.hFEptoOBcLSVu",
//         "rol": "PACIENTE",
//         "email": "prueba@hotmail.com",
//         "state": true,
//         "creationDate": "2024-05-29T00:31:08.000Z",
//         "modificationDate": "2024-05-29T00:31:08.000Z",
//         "personId": 2,
//         "Person": {
//             "id": 2,
//             "firstName": "María",
//             "lastName": "López",
//             "birthDate": "1995-11-20T00:00:00.000Z",
//             "numberDocument": "35204958",
//             "typeDocument": "DNI",
//             "sex": "Femenino",
//             "state": true,
//             "creationDate": "2024-05-29T05:33:46.000Z",
//             "ModificationDate": "2024-05-29T05:33:46.000Z"
//         }
//     }
// }

function ageBirth(birthDate) {
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    return age;
}

module.exports = { mapPatientData }