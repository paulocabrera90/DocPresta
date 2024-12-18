const { Profesional, Speciality,Benefit, Profesion, Prescription , Patient, Sickness, sequelize} = require('../models/index.models');
const { httpError } = require('../helpers/handleError');
const { where } = require('sequelize');
const storage = require('../storage/session');
const PDFDocument = require('pdfkit');
const { getAllMedicalRecordsService, createMedicalRecordService, updateMedicalRecordService, deleteMedicalRecordService, getMedicalRecordByIdService, getAllMedicalRecordsByPatientIdService, getAllMedicalRecordsFilterService } = require('../services/medical-record.service');
const { getListAllPatients } = require('./patient.controller');
const { getListAllPatientsService } = require('../services/patient.service');
const { getFindAllSections } = require('../services/benefit.service');
const { createMedicineService } = require('../services/medicine.service');
const { mapPatientData } = require('../models/mappers/patient.mapper');
const { mapMedicalRecord } = require('../models/mappers/medicalRecord.mapper');

async function medicalRecordNew(req, res){   
    try {

        const profesional = await Profesional.findOne({
            where: {userId: storage.state.user.id},
            include: [
                { model: Speciality, as: 'Speciality' }
            ]
        })
        const allPatient = await getListAllPatientsService();
    
        const speciality = profesional.dataValues.Speciality.dataValues;
        const profesion = await Profesion.findOne({ where: { id: speciality.profesionId } })

        const sections = await getFindAllSections(); 
        const sickness = await Sickness.findAll()
    
        res.render('medical-record-new', { 
            medicalRecord: '',
            person: storage.state.user.Person,
            profesional: profesional.dataValues,
            speciality,
            profesion:profesion.dataValues,
            patients: allPatient.map(mapPatientData),
            sections,
            sickness
        });
    } catch (error) {
        httpError(res, error);
    }    
}

async function getMedicalRecordById (req, res) {
    const { id } = req.params;
    try {
        const user = storage.state.user;
        const medicalRecord = await getMedicalRecordByIdService(id);
        if (!medicalRecord) {
            return res.status(404).json({ message: 'Prescripcion no encontrada.' });
        }

        var profesional = {};
        var speciality = {};
        var profesion = {};

        if(user.rol==='PROFESIONAL'){
            profesional = await Profesional.findOne({
                where: {userId: storage.state.user.id},
                include: [
                    { model: Speciality, as: 'Speciality' }
                ]
            })

            speciality = profesional.dataValues.Speciality.dataValues;
            profesion = await Profesion.findOne({ where: { id: speciality.profesionId } })
        }
        
        const allPatient = await getListAllPatientsService();

        const sections = await getFindAllSections(); 
        const sickness = await Sickness.findAll()
    
        
        if (req.query.format === 'json') {
            res.json({ 
                medicalRecord: mapMedicalRecord(medicalRecord),
                person: storage.state.user.Person,
                profesional: profesional ? profesional.dataValues: '',
                speciality,
                profesion: profesion ? profesion.dataValues: '',
                patients: allPatient.map(mapPatientData),
                sections,
                sickness
            });
        }else{
            res.render('medical-record-new', { 
                medicalRecord: mapMedicalRecord(medicalRecord),
                person: storage.state.user.Person,
                profesional: profesional ? profesional.dataValues: '',
                speciality,
                profesion: profesion ? profesion.dataValues: '',
                patients: allPatient.map(mapPatientData),
                sections,
                sickness,
                user:user.rol==='PACIENTE' || user.rol==='ADMIN'? user:''
            });
        }

    } catch (error) {
        httpError(res, error);
    }
}
function isPatient(params) {
    
}

async function getMedicalRecordByPatientId (req, res) {
    const { id } = req.params;
    try {
        const user = storage.state.user;
        const { medicalRecords, profesional, speciality, profesion } = await getAllMedicalRecordsByPatientIdService(id);

        if (req.query.format === 'json') {
            res.json({ medicalRecords, speciality, profesion, profesional });
        }else{
            res.render('medical-record-landing', { medicalRecords, speciality, profesion, profesional, user:'' });
        }
       
    } catch (error) {
        httpError(res, error);
    }
}

async function getListAllMedicalRecord(req, res){
    try {
        const user = storage.state.user;
        
        
        if(user.rol === 'PACIENTE'){
            const patientId = user.Patient.id;
            const { medicalRecords, profesional, speciality, profesion } = await getAllMedicalRecordsByPatientIdService(patientId)
            res.render('medical-record-landing',{ medicalRecords, speciality, profesion, profesional, user });
            return;
        }
        const { medicalRecords, profesional, speciality, profesion } = await getAllMedicalRecordsService(user.id);
        res.render('medical-record-landing',{ medicalRecords, speciality, profesion, profesional, user:'' });
       
    } catch (error) {
        httpError(res, error);
    }
}

async function getListAllMedicalRecordFilter(req, res){
    try {
        const user = storage.state.user;        

        const filters = {
            numberDocument: req.query.numberDocument || null,
            prescriptionDate: req.query.prescriptionDate || null,
            disease: req.query.disease || null
        };

        if(user.rol === 'PACIENTE'){
            filters.numberDocument = user.Person.numberDocument;
            user.id = '';
        }

        const { medicalRecords, profesional, speciality, profesion } = await getAllMedicalRecordsFilterService(user.id, filters);
            
        if(user.rol === 'PACIENTE'){
             res.render('medical-record-landing',{ medicalRecords, speciality, profesion, profesional, user });
        }
        res.render('medical-record-landing',{ medicalRecords, speciality, profesion, profesional, user:'' });
       
    } catch (error) {
        httpError(res, error);
    }
}

async function createMedicalRecord(req, res) {
    const userId = storage.state.user.id;
    const transaction = await sequelize.transaction();
    try {
        const newMedicine = await createMedicalRecordService(req.body);
        console.log("Create medicine successfully: ", req.body);
        res.status(200).json({ message: "Create medicine successfully", data: newMedicine });
    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function updateMedicalRecord(req, res) {
    const { id } = req.params;
    const transaction = await sequelize.transaction();

    try {
        console.log("Updating medical record with ID:", id);
        const updatedMedicalRecord = await updateMedicalRecordService(id, req.body);
        console.log("Update medical record successfully");
        res.status(200).json({ message: "Update medical record successfully", data: updatedMedicalRecord });
    
    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function generatePdf(req, res) {
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
                'Content-disposition': 'attachment;filename=registros_medicos.pdf',
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
            doc.fontSize(10)
               .text(`NRO de Receta: ${record.id}`, { underline: true })
               .text(`Fecha de Prescripción: ${new Date(record.prescriptionDate).toLocaleDateString()}`)
               .text(`Paciente: ${record.Patients.User.Person.firstName} ${record.Patients.User.Person.lastName}`)
               .text(`Enfermedad: ${record.Sicknesses.name}`)
               .text(`Profesional: ${record.Profesionals.User.Person.firstName} ${record.Profesionals.User.Person.lastName}`)
               .moveDown();

            // Beneficios
            if (record.Benefits && record.Benefits.length > 0) {
                record.Benefits.forEach(benefit => {
                    doc.text(`Beneficio: ${benefit.name}`)
                       .text(`Código de Beneficio: ${benefit.code}`)
                       .text(`Descripción: ${benefit.description}`)
                       .moveDown();
                });
            }

            // Medicamentos
            if (record.Medicines && record.Medicines.length > 0) {
                record.Medicines.forEach(medicine => {
                    doc.text(`Medicamento: ${medicine.name} - ${medicine.code}`)
                       .text(`Forma: ${medicine.PharmaForms.map(form => form.name).join(", ")}`)
                       .moveDown();
                });
            }

            // Usar líneas divisorias para mejorar la legibilidad
            doc.strokeColor("#aaaaaa").lineWidth(0.5).moveTo(80, doc.y).lineTo(520, doc.y).stroke();
            doc.moveDown();
        });

        doc.end();
        console.log('PDF generado exitosamente.');
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error al generar el PDF: ', error);
    }
}


async function deleteMedicalRecord(req, res) {
    const { id } = req.params;
    const transaction = await sequelize.transaction();

    try {
        await deleteMedicalRecordService(id);
        await transaction.commit();
        res.status(200).json({ id });
    } catch (error) {

        await transaction.rollback();
        httpError(res, error);
    }
}

module.exports= { 
    medicalRecordNew,
    getListAllMedicalRecord,
    getListAllMedicalRecordFilter,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    generatePdf,
    getMedicalRecordById,
    getMedicalRecordByPatientId
}