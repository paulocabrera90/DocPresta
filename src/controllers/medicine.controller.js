const { Medicine, FamilyMedicine, ConcentratedMedicine, QuantityMed, PharmaForm, ComercialMedicine, sequelize } = require('../models/index.models');
const { mapMedicineData, mapMedicineToItems } = require('../models/mappers/medicine.mapper');
const { httpError } = require('../helpers/handleError');

async function getMedicineById(req, res) {
    const { id } = req.params;
    try {
        const medicine = await Medicine.findOne({
            where: { id },
            include: [
                {
                    model: ConcentratedMedicine,
                    as: 'ConcentratedMedicines'
                },
                {
                    model: QuantityMed,
                    as: 'QuantityMeds'
                },
                {
                    model: PharmaForm,
                    as: 'PharmaForms'
                },
                {
                    model: ComercialMedicine,
                    as: 'ComercialMedicines'
                },
                {
                    model: FamilyMedicine,
                    as: 'FamilyMedicines'
                }
            ]
        });

        if (!medicine) {
            return res.render('medicine-new', {
                medicine: '',
                concentratedMedicine: await ConcentratedMedicine.findAll({
                    attributes: ['quantity'],
                    group: ['quantity'],
                    order: [['quantity', 'ASC']]
                }),
                quantityMed: await QuantityMed.findAll(),
                pharmaForm: await PharmaForm.findAll(),
                family: await FamilyMedicine.findAll(),
                comercialMedicine: await ComercialMedicine.findAll()
            });
        }

        const items = mapMedicineToItems(medicine);
        const medicineMap = mapMedicineData(medicine);
        console.log("medicineMap", medicineMap)

        res.render('medicine-new', {
            medicine: medicineMap,
            items,
            concentratedMedicine: await ConcentratedMedicine.findAll({
                attributes: ['quantity'],
                group: ['quantity'],
                order: [['quantity', 'ASC']]
            }),
            quantityMed: await QuantityMed.findAll(),
            pharmaForm: await PharmaForm.findAll(),
            family: await FamilyMedicine.findAll(),
            comercialMedicine: await ComercialMedicine.findAll()
        });
        // res.json({data: medicine, items });
    } catch (error) {
        httpError(res, error);
    }
}

async function getListAllMedicines(req, res) {
    try {
        const medicine = await Medicine.findAll({
            include: [
                {
                    model: ConcentratedMedicine,
                    as: 'ConcentratedMedicines'
                },
                {
                    model: QuantityMed,
                    as: 'QuantityMeds'
                },
                {
                    model: PharmaForm,
                    as: 'PharmaForms'
                },
                {
                    model: ComercialMedicine,
                    as: 'ComercialMedicines'
                },
                {
                    model: FamilyMedicine,
                    as: 'FamilyMedicines'
                }
            ]
        });

        res.render('medicine-landing', {
            medicines: medicine
        });
        //res.json({data:medicine})

    } catch (error) {
        httpError(res, error);
    }
}

async function newMedicine(req, res) {
    try {
        return res.render('medicine-new', {
            concentratedMedicine: await ConcentratedMedicine.findAll({
                attributes: ['quantity'],
                group: ['quantity'],
                order: [['quantity', 'ASC']]
            }),
            quantityMed: await QuantityMed.findAll(),
            pharmaForm: await PharmaForm.findAll(),
            family: await FamilyMedicine.findAll()
        });

    } catch (error) {
        httpError(res, error);
    }
}

async function createMedicine(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const { name, code, active, items } = req.body;
        console.log("Body", req.body)
        console.log("Create medicine")

        const itemsJson = JSON.parse(items);

        const checkActive = (active === 'Activo') ? 1 : 0;

        const newMedicine = await Medicine.create({
            name,
            code,
            state: checkActive,
            creatiionDate: Date.now(),
            modificationDate: Date.now(),
        }, { transaction });

        for (const element of itemsJson) {

            let familyMedicine = await FamilyMedicine.findOne({
                where: { name: element.familyMedicineName }
            });

            if (!familyMedicine) {
                familyMedicine = await FamilyMedicine.create({
                    name: element.familyMedicineName,
                    creatiionDate: Date.now(),
                    modificationDate: Date.now()
                }, { transaction })
            }

            let comercialMedicine = await ComercialMedicine.findOne({
                where: { name: element.comercialName }
            })

            if (!comercialMedicine) {
                comercialMedicine = await ComercialMedicine.create({
                    name: element.comercialName,
                    creatiionDate: Date.now(),
                    modificationDate: Date.now()
                }, { transaction })
            }

            let concentratedMedicine = await ConcentratedMedicine.findOne({
                where: {
                    magnitude: element.magnitude,
                    quantity: element.quantityId
                }
            });

            if (!concentratedMedicine) {
                concentratedMedicine = await ConcentratedMedicine.create({
                    quantity: element.quantityId,
                    magnitude: element.magnitude,
                    creationDate: Date.now(),
                    modificationDate: Date.now()
                }, { transaction })
            }

            let quantityMed = await QuantityMed.findOne({
                where: { id: element.quantityMedList },
                transaction
            });

            let pharmaForm = await PharmaForm.findOne({
                where: { name: element.pharmaTypeId },
                transaction
            });

            await newMedicine.addComercialMedicine(comercialMedicine.id, { transaction });
            await newMedicine.addQuantityMed(quantityMed.id, { transaction });
            await newMedicine.addPharmaForm(pharmaForm.id, { transaction });
            await newMedicine.addConcentratedMedicine(concentratedMedicine.id, { transaction });
            await newMedicine.addFamilyMedicine(familyMedicine.id, { transaction });
        };

        await transaction.commit();
        console.log("Create medicine successfully")
        res.status(200).json({ message: "Create medicine successfully", data: "newMedicine" });

    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function updateMedicine(req, res) {
    const transaction = await sequelize.transaction();
    const { id } = req.params;
    try {
        const { name, code, active, items } = req.body;
        console.log("Body", req.body);
        console.log("Update medicine");

        if (!items) {
            throw new Error('Properties not found');
        }

        const itemsJson = JSON.parse(items);
        const checkActive = (active === 'Activo') ? 1 : 0;

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
                {
                    model: ConcentratedMedicine,
                    as: 'ConcentratedMedicines'
                },
                {
                    model: QuantityMed,
                    as: 'QuantityMeds'
                },
                {
                    model: PharmaForm,
                    as: 'PharmaForms'
                },
                {
                    model: ComercialMedicine,
                    as: 'ComercialMedicines'
                },
                {
                    model: FamilyMedicine,
                    as: 'FamilyMedicines'
                }
            ]
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

            let familyMedicine = await FamilyMedicine.findOne({
                where: { name: element.familyMedicineName },
                transaction
            });

            if (!familyMedicine) {
                familyMedicine = await FamilyMedicine.create({
                    name: element.familyMedicineName,
                    creationDate: Date.now(),
                    modificationDate: Date.now()
                }, { transaction });
            }

            let comercialMedicine = await ComercialMedicine.findOne({
                where: { name: element.comercialName },
                transaction
            });

            if (!comercialMedicine) {
                comercialMedicine = await ComercialMedicine.create({
                    name: element.comercialName,
                    creationDate: Date.now(),
                    modificationDate: Date.now()
                }, { transaction })
            }

            let concentratedMedicine = await ConcentratedMedicine.findOne({
                where: {
                    magnitude: element.magnitude,
                    quantity: element.quantityId
                },
                transaction
            });

            if (!concentratedMedicine) {
                concentratedMedicine = await ConcentratedMedicine.create({
                    quantity: element.quantityId,
                    magnitude: element.magnitude,
                    creationDate: Date.now(),
                    modificationDate: Date.now()
                }, { transaction });


            }
            let pharmaMedicine = await PharmaForm.findOne({
                where: { name: element.pharmaTypeId },
                transaction
            });
            let quantityMed = await QuantityMed.findOne({
                where: { quantity: element.quantityMedList },
                transaction
            });

            await updatedMedicine.addComercialMedicine(comercialMedicine.id, { transaction });
            await updatedMedicine.addQuantityMed(quantityMed.id, { transaction });
            await updatedMedicine.addPharmaForm(pharmaMedicine.id, { transaction });
            await updatedMedicine.addConcentratedMedicine(concentratedMedicine.id, { transaction });
            await updatedMedicine.addFamilyMedicine(familyMedicine.id, { transaction });

        };

        await transaction.commit();
        console.log("Update medicine successfully");
        res.status(200).json({ message: "Update medicine successfully", data: updatedMedicine });

    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function deleteMedicine(req, res) {
    const { id } = req.params;
    const transaction = await sequelize.transaction();

    try {

        const updatedMedicine = await Medicine.findByPk(id, {
            include: [
                {
                    model: ConcentratedMedicine,
                    as: 'ConcentratedMedicines'
                },
                {
                    model: QuantityMed,
                    as: 'QuantityMeds'
                },
                {
                    model: PharmaForm,
                    as: 'PharmaForms'
                },
                {
                    model: ComercialMedicine,
                    as: 'ComercialMedicines'
                },
                {
                    model: FamilyMedicine,
                    as: 'FamilyMedicines'
                }
            ]
        });
        
        if (!updatedMedicine) {
            throw new Error('Medicine not found');
        } 
        
        await updatedMedicine.setConcentratedMedicines([], { transaction });
        await updatedMedicine.setQuantityMeds([], { transaction });
        await updatedMedicine.setPharmaForms([], { transaction });
        await updatedMedicine.setFamilyMedicines([], { transaction });
        await updatedMedicine.setComercialMedicines([], { transaction });

        await Medicine.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();

        res.status(200).json({ id });
    } catch (error) {

        await transaction.rollback();
        httpError(res, error);
    }
}

module.exports = { getMedicineById, getListAllMedicines, newMedicine, createMedicine, deleteMedicine, updateMedicine }