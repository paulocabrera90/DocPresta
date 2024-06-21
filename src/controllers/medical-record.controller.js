const { Profesional, Speciality,Benefit, Profesion, Prescription , Patient, Sickness} = require('../models/index.models');
const { httpError } = require('../helpers/handleError');
const { where } = require('sequelize');
const storage = require('../storage/session');
const PDFDocument = require('pdfkit');
const { getAllMedicalRecordsService } = require('../services/medical-record.service');
const { getListAllPatients } = require('./patient.controller');
const { getListAllPatientsService } = require('../services/patient.service');

async function medicalRecordNew(req, res){   
    try {
        const medicalRecord  = await Prescription.findAll({
            include: [
                {
                    model: Benefit,
                    as: 'Benefits'
                },
                {
                    model: Patient,
                    as: 'Patients'
                },
                {
                    model: Sickness,
                    as: 'Sicknesses'
                },
                {
                    model: Profesional,
                    as: 'Profesionals'
                }
            ]
        })

        const profesional = await Profesional.findOne({
            where: {userId: storage.state.user.id},
            include: [
                {
                    model: Speciality,
                    as: 'Speciality'
                }
            ]
        })
        const allPatient = await getListAllPatientsService();
    
        const speciality = profesional.dataValues.Speciality.dataValues;
        const profesion = await Profesion.findOne({ where: { id: speciality.profesionId } })
    
        res.render('medical-record-new', { 
            medicalRecord,
            person: storage.state.user.Person,
            profesional: profesional.dataValues,
            speciality,
            profesion:profesion.dataValues,
            patients:allPatient
        })

        // res.json({ 
        //     medicalRecord,
        //     person: storage.state.user.Person,
        //     profesional: profesional.dataValues,
        //     speciality,
        //     profesion:profesion.dataValues,
        //     patients:allPatient
        // })
    } catch (error) {
        httpError(res, error);
    }
    
}


async function getListAllMedicalRecord(req, res){
    try {
        const userId = storage.state.user.id;
        const { medicalRecords, profesional, speciality, profesion } = await getAllMedicalRecordsService(userId);
            
        res.render('medical-record-landing', { medicalRecords, speciality, profesion, profesional });
          
        //res.json({ medicalRecords, speciality, profesion, profesional });
       
    } catch (error) {
        httpError(res, error);
    }
}

async function generatePdf (req, res) {
   try {

        const userId = storage.state.user.id;
        const { medicalRecords, profesional, speciality, profesion } = await getAllMedicalRecordsService(userId);

        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            res.writeHead(200, {
              'Content-Length': Buffer.byteLength(pdfData),
              'Content-Type': 'application/pdf',
              'Content-disposition': 'attachment;filename=registros.pdf',
            })
            .end(pdfData);
        });
        
         // Configuración inicial del PDF
        doc.font('Helvetica')
         .fontSize(12)
         .text('Registros Médicos', { align: 'center' });
        doc.moveDown();

        // Iterar sobre cada registro médico
        medicalRecords.forEach(record => {
            console.log("RECORD", record)
            doc.fontSize(10).text(`NRO de Receta: ${record.id}`, { underline: true });
            doc.text(`Fecha de Prescripción: ${record.prescriptionDate}`);
            doc.text(`Paciente: ${record.Patients.User.Person.firstName} ${record.Patients.User.Person.lastName}`);
            doc.text(`Enfermedad: ${record.Sicknesses.name}`);
            doc.text(`Profesional: ${record.Profesionals.User.Person.firstName} ${record.Profesionals.User.Person.lastName}`);
            doc.moveDown();

            // Beneficios
            doc.text(`Beneficio: ${record.Benefits.name}`);
            doc.text(`Código de Beneficio: ${record.Benefits.code}`);
            doc.text(`Descripción: ${record.Benefits.description}`);
            doc.moveDown(2);

            // Usar líneas divisorias para mejorar la legibilidad
            doc.strokeColor("#aaaaaa").lineWidth(0.5).moveTo(80, doc.y).lineTo(520, doc.y).stroke();
            doc.moveDown();
        });
        doc.end();
        console.log('PDF generado exitosamente.');
      } catch (error) {
        httpError(res, error);
      }
}

module.exports= { 
    medicalRecordNew,
    getListAllMedicalRecord,
    generatePdf
}