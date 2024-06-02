const { httpError } = require('../helpers/handleError');
const { Profesional, Speciality, User, Person } = require('../models/index.models');

async function getListAllProfesional(req, res){
    try {
        const profesional = await Profesional.findAll({
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
        });

        // res.render('profesional-landing', {
        //     profesional: profesional.map(p => ({
        //         ...p.dataValues,
        //         creationDate: new Date(p.creationDate),
        //         modificationDate: new Date(p.modificationDate)
        //     }))
        // });

        res.json(profesional);

    } catch(error) {
        httpError(res, error);
    }
}

module.exports= { 
    getListAllProfesional
}