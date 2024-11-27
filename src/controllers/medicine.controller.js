const { sequelize } = require('../models/index.models');
const { httpError } = require('../helpers/handleError');
const {  getMedicineDetailByIdService,
    getAllMedicinesService,
    createMedicineService,
    updateMedicineService,
    deleteMedicineService,
    getNewMedicineService, } = require('../services/medicine.service');

async function getMedicineByIdController(req, res) {
    try {
        const { id } = req.params;
        try {
            const result = await getMedicineDetailByIdService(id);
    
            if (!result.medicine) {
                return res.render('medicine-new', {
                    medicine: '',
                    ...result.dropdownData
                });
            }
    
            res.render('medicine-new', {
                ...result,
                ...result.dropdownData
            });
        } catch (error) {
            httpError(res, error);
        }
        // res.json({data: medicine, items });
    } catch (error) {
        httpError(res, error);
    }
}

async function getListAllMedicinesController(req, res) {
    try {
        const medicines = await getAllMedicinesService();

        res.render('medicine-landing', {
            medicines
        });
        //res.json({data:medicine})

    } catch (error) {
        httpError(res, error);
    }
}

async function newMedicineController(req, res) {
    try {
        const data = await getNewMedicineService();

        return res.render('medicine-new', data);
    } catch (error) {
        httpError(res, error);
    }
}

async function createMedicineController(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const newMedicine = await createMedicineService(req.body);
        console.log("Create medicine successfully");
        res.status(200).json({ message: "Create medicine successfully", data: newMedicine });

    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function updateMedicineController(req, res) {
    const { id } = req.params;
    const transaction = await sequelize.transaction();

    try {
        console.log("Updating medicine with ID:", id);
        const updatedMedicine = await updateMedicineService(id, req.body, transaction);
        console.log("Update medicine successfully");
        res.status(200).json({ message: "Update medicine successfully", data: updatedMedicine });
    
    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function deleteMedicineController(req, res) {
    const { id } = req.params;
    const transaction = await sequelize.transaction();

    try {
        await deleteMedicineService(id, transaction);
        await transaction.commit();
        res.status(200).json({ id });
    } catch (error) {

        await transaction.rollback();
        httpError(res, error);
    }
}

module.exports = { 
    getMedicineByIdController, 
    getListAllMedicinesController, 
    newMedicineController, 
    createMedicineController, 
    deleteMedicineController, 
    updateMedicineController 
}