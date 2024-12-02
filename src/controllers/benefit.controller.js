const { httpError } = require("../helpers/handleError");
const { getListAllBenefitsService, getFindAllSections, createBenefitService, getFindBenefitByIdService, updateBenefitService, deleteBenefitService } = require("../services/benefit.service");
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

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function getFindBenefitByIdController(req, res) {
    try {
        const { id } = req.params;
        const result = await getFindBenefitByIdService(id);
    
            if (!result.benefit) {
                return res.render('benefit-new', {
                    medicine: '',
                    ...result.sections
                });
            }
    
            res.render('benefit-new', {
                ...result,
                ...result.sections
            });
         //res.json({data: result });
    } catch (error) {
        httpError(res, error);
    }
}

async function updateBenefitController(req, res) {
    const { id } = req.params;
    const transaction = await sequelize.transaction();

    try {
        console.log("Updating benefit with ID:", id);
        const updatedBenefit = await updateBenefitService(id, req.body);

        console.log("Update medicine successfully");
        res.status(200).json({ message: "Update benefit successfully", data: updatedBenefit });
    
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function deleteBenefitController(req, res) {
    const { id } = req.params;
    const transaction = await sequelize.transaction();

    try {
        await deleteBenefitService(id);
        await transaction.commit();
        res.status(200).json({ id });
    } catch (error) {

        await transaction.rollback();
        httpError(res, error);
    }
}

module.exports = { 
    getListAllBenefitsController,
    newBenefitController,
    createBenefitController,
    getFindBenefitByIdController,
    deleteBenefitController,
    updateBenefitController
}