const { Patient, User, Person, PlanOS } = require('../models/index.models');
const { mapPatientData } = require('../models/mappers/patient.mapper');

async function getPatientController (req, res) {
    try {
        const dni = req.params.dni;
        const patient = await Person.findOne({ 
            where: { numberDocument: dni },
            include: {
                model: User,
                as: 'User',
                where: { rol: 'PACIENTE' },
                include: {
                    model: Patient,
                    as: 'Patient',
                    include: {
                        model: PlanOS,
                        as: 'PlanOS',
                        where: { id: 11},
                    }
                }
            }
         });

        if (!patient || !patient.User || !patient.User.Patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        const mappedData = mapPatientData(patient);
        
        console.log("patient", patient.User.Patient);
        res.status(200).json({ data: mappedData}) ;
        //res.render("medical-record-new",{ patient: mappedData});
    } catch (error) {
        res.status(500).json({ error: 'Error to get patient: ' + error });
    }
}

module.exports = { getPatientController }