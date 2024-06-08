const storage = require("../storage/session")
const { Profesional, Speciality, Profesion } = require('../models/index.models');

async function medicalRecordNew(req, res){   
    console.log("storage.state.user", storage.state.user);
    const profesional = await Profesional.findOne({
        where: {userId: storage.state.user.id},
        include: [
            {
                model: Speciality,
                as: 'Speciality'
            }
        ]
    })

    const speciality = profesional.dataValues.Speciality.dataValues;
    const profesion = await Profesion.findOne({ where: { id: speciality.profesionId } })

    res.render('medical-record-new', { 
        person: storage.state.user.Person,
        profesional: profesional.dataValues,
        speciality,
        profesion:profesion.dataValues
    })
}

module.exports= { 
    medicalRecordNew
}