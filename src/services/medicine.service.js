const { Medicine, FamilyMedicine, ConcentratedMedicine, QuantityMed, PharmaForm, ComercialMedicine, sequelize } = require('../models/index.models');
const { mapMedicineData, mapMedicineToItems } = require('../models/mappers/medicine.mapper');

async function getMedicineDetailByIdService(id) {
    const medicine = await Medicine.findOne({
        where: { id },
        include: [
            { model: ConcentratedMedicine, as: 'ConcentratedMedicines' },
            { model: QuantityMed, as: 'QuantityMeds' },
            { model: PharmaForm, as: 'PharmaForms' },
            { model: ComercialMedicine, as: 'ComercialMedicines' },
            { model: FamilyMedicine, as: 'FamilyMedicines' }
        ]
    });

    if (!medicine) {
        return {
            medicine: '',
            dropdownData: await getDropdownData()
        };
    }

    const items = mapMedicineToItems(medicine);
    const medicineMap = mapMedicineData(medicine);

    return {
        medicine: medicineMap,
        items,
        dropdownData: await getDropdownData()
    };
}

async function getDropdownData() {
    return {
        concentratedMedicine: await ConcentratedMedicine.findAll({
            attributes: ['quantity'],
            group: ['quantity'],
            order: [['quantity', 'ASC']]
        }),
        quantityMed: await QuantityMed.findAll(),
        pharmaForm: await PharmaForm.findAll(),
        family: await FamilyMedicine.findAll(),
        comercialMedicine: await ComercialMedicine.findAll()
    };
}

async function getAllMedicinesService() {
    return await Medicine.findAll({
        include: [
            { model: ConcentratedMedicine, as: 'ConcentratedMedicines' },
            { model: QuantityMed, as: 'QuantityMeds' },
            { model: PharmaForm, as: 'PharmaForms' },
            { model: ComercialMedicine, as: 'ComercialMedicines' },
            { model: FamilyMedicine, as: 'FamilyMedicines' }
        ]
    });
}

async function createMedicineService(medicineData) {
    const transaction = await sequelize.transaction();
    try {
        const { name, code, active, items} = medicineData;

        const checkActive = (active === 'Activo') ? 1 : 0;
        const itemsJson = JSON.parse(items);

        const newMedicine = await Medicine.create({
            name,
            code,
            state: checkActive,
            creationDate: Date.now(),
            modificationDate: Date.now(),
        }, { transaction });

        for (const element of itemsJson) {
            let familyMedicine = await findOrCreateFamilyMedicine(element.familyMedicineName, transaction);
            let comercialMedicine = await findOrCreateComercialMedicine(element.comercialName, transaction);
            let concentratedMedicine = await findOrCreateConcentratedMedicine(element, transaction);
            let quantityMed = await QuantityMed.findOne({ where: { id: element.quantityMedList }, transaction });
            let pharmaForm = await PharmaForm.findOne({ where: { name: element.pharmaTypeId }, transaction });

            await newMedicine.addComercialMedicine(comercialMedicine, { transaction });
            await newMedicine.addQuantityMed(quantityMed, { transaction });
            await newMedicine.addPharmaForm(pharmaForm, { transaction });
            await newMedicine.addConcentratedMedicine(concentratedMedicine, { transaction });
            await newMedicine.addFamilyMedicine(familyMedicine, { transaction });
        }

        await transaction.commit();
        return newMedicine;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function updateMedicineService(id, medicineData, transaction) {
 //   const transaction = await sequelize.transaction();
    try {
        
        const { name, code, active, items} = medicineData;
        const checkActive = (active === 'Activo') ? 1 : 0;
        const itemsJson = JSON.parse(items);

        await Medicine.update({
            name,
            code,
            state: checkActive,
            modificationDate: Date.now(),
        }, {
            where: { id },
            transaction
        });

        const updatedMedicine = await Medicine.findByPk(id, {
            include: [
                { model: ConcentratedMedicine, as: 'ConcentratedMedicines' },
                { model: QuantityMed, as: 'QuantityMeds' },
                { model: PharmaForm, as: 'PharmaForms' },
                { model: ComercialMedicine, as: 'ComercialMedicines' },
                { model: FamilyMedicine, as: 'FamilyMedicines' }
            ],
            transaction
        });

        if (!updatedMedicine) {
            throw new Error('Medicine not found');
        }

        await updatedMedicine.setConcentratedMedicines([], { transaction });
        await updatedMedicine.setQuantityMeds([], { transaction });
        await updatedMedicine.setPharmaForms([], { transaction });
        await updatedMedicine.setFamilyMedicines([], { transaction });
        await updatedMedicine.setComercialMedicines([], { transaction });

        for (const element of itemsJson) {
            const familyMedicine = await findOrCreateFamilyMedicine(element.familyMedicineName, transaction);
            const comercialMedicine = await findOrCreateComercialMedicine(element.comercialName, transaction);
            const concentratedMedicine = await findOrCreateConcentratedMedicine(element, transaction);
            const pharmaMedicine = await PharmaForm.findOne({ where: { name: element.pharmaTypeId }, transaction });
            const quantityMed = await QuantityMed.findOne({ where: { quantity: element.quantityMedList }, transaction });

            await updatedMedicine.addComercialMedicine(comercialMedicine.id, { transaction });
            await updatedMedicine.addQuantityMed(quantityMed.id, { transaction });
            await updatedMedicine.addPharmaForm(pharmaMedicine.id, { transaction });
            await updatedMedicine.addConcentratedMedicine(concentratedMedicine.id, { transaction });
            await updatedMedicine.addFamilyMedicine(familyMedicine.id, { transaction });
        }

        await transaction.commit();
        return updatedMedicine;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function deleteMedicineService(id, transaction) {

    try {
        const medicine = await Medicine.findByPk(id, {
            include: [
                { model: ConcentratedMedicine, as: 'ConcentratedMedicines' },
                { model: QuantityMed, as: 'QuantityMeds' },
                { model: PharmaForm, as: 'PharmaForms' },
                { model: ComercialMedicine, as: 'ComercialMedicines' },
                { model: FamilyMedicine, as: 'FamilyMedicines' }
            ]
        });
    
        if (!medicine) {
            throw new Error('Medicine not found');
        }
    
        await medicine.setConcentratedMedicines([], { transaction });
        await medicine.setQuantityMeds([], { transaction });
        await medicine.setPharmaForms([], { transaction });
        await medicine.setFamilyMedicines([], { transaction });
        await medicine.setComercialMedicines([], { transaction });
    
        await Medicine.destroy({
            where: { id },
            transaction
        });
    
        return id;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function getNewMedicineService() {
    return {
        concentratedMedicine: await ConcentratedMedicine.findAll({
            attributes: ['quantity'],
            group: ['quantity'],
            order: [['quantity', 'ASC']]
        }),
        quantityMed: await QuantityMed.findAll(),
        pharmaForm: await PharmaForm.findAll(),
        family: await FamilyMedicine.findAll()
    };
}

async function findOrCreateFamilyMedicine(name, transaction) {
    let medicine = await FamilyMedicine.findOne({ where: { name }, transaction });
    if (!medicine) {
        medicine = await FamilyMedicine.create({ name, creationDate: Date.now(), modificationDate: Date.now() }, { transaction });
    }
    return medicine;
}

async function findOrCreateComercialMedicine(name, transaction) {
    let medicine = await ComercialMedicine.findOne({ where: { name }, transaction });
    if (!medicine) {
        medicine = await ComercialMedicine.create({ name, creationDate: Date.now(), modificationDate: Date.now() }, { transaction });
    }
    return medicine;
}

async function findOrCreateConcentratedMedicine(element, transaction) {
    let medicine = await ConcentratedMedicine.findOne({ where: { magnitude: element.magnitude, quantity: element.quantityId }, transaction });
    if (!medicine) {
        medicine = await ConcentratedMedicine.create({ quantity: element.quantityId, magnitude: element.magnitude, creationDate: Date.now(), modificationDate: Date.now() }, { transaction });
    }
    return medicine;
}

module.exports = {
    getMedicineDetailByIdService,
    getAllMedicinesService,
    createMedicineService,
    updateMedicineService,
    deleteMedicineService,
    getNewMedicineService,
    getDropdownData
};
