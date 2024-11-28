const { httpError } = require("../helpers/handleError");
const { getListAllBenefitsService, getFindAllSections, createBenefitService } = require("../services/benefit.service");
const { sequelize } = require('../models/index.models');

async function getListAllBenefitsController(req, res){
    try {
        const benefits = await getListAllBenefitsService();
        
        console.log(benefits);
       // const listMapPatient = patient.map(mapPatientData);

        res.render('benefit-landing', { 
            benefits: benefits
        });       
       //res.json({data:listMapPatient})

    } catch(error) {
        httpError(res, error);
    }
}

async function newBenefitController(req, res) {
    try {
        const sections = await getFindAllSections(); 
        res.render('benefit-new', { sections });
    } catch (error) {
        httpError(res, error);
    }
}

async function createBenefitController(req, res) {
    const transaction = await sequelize.transaction();
    try {
        
        console.log("Create Benefit: ", req.body)
        const benefit = await createBenefitService(req.body);
        console.log("Create Benefit successfully")
        res.status(200).json({message: "Create Benefit successfully", benefit});

    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

module.exports = { 
    getListAllBenefitsController,
    newBenefitController,
    createBenefitController
}