const { Patient, User, Person } = require('../models/index.models');

async function getPatientController (req, res) {
    try {
        const dni = req.params.dni;
        console.log("DNI", dni)
        const patient = await Person.findOne({ 
            where: { numberDocument: dni },
            include: {
                model: User,
                as: 'User',
                where: { rol: 'PACIENTE' },
                include: {
                    model: Patient,
                    as: 'Patient'
                }
            }
         });

         if (!patient || !patient.User || !patient.User.Patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        console.log("patient", patient)
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar todos los usuarios. ' + error });
    }
}

module.exports = { getPatientController }