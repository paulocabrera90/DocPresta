const { Medicine, User, FamilyMedicine, Person, ConcentratedMedicine, QuantityMed, PharmaForm, ComercialMedicine,sequelize } = require('../models/index.models');
const { mapMedicineData } = require('../models/mappers/medicine.mapper');
const { httpError } = require('../helpers/handleError');
const { encrypt } = require('../utils/handleBcrypt');
const { where } = require('sequelize');

async function getMedicineById (req, res) {
    const { id } = req.params;
    try {
        const medicine = await Medicine.findOne({ 
            where: { id },
            include: [
                {
                    model: ConcentratedMedicine,
                    as: 'ConcentratedMedicine'
                },
                {
                    model: QuantityMed,
                    as: 'QuantityMed'
                },
                {
                    model: PharmaForm,
                    as: 'PharmaForm'
                },
                {
                    model: ComercialMedicine,
                    as: 'ComercialMedicine'
                }
            ]
        });

        // if (!medicine) {
        //     return res.render('medicine-new', { 
        //         medicine: '',
        //         concentratedMedicine: await ConcentratedMedicine.findAll(),
        //         quantityMed: await QuantityMed.findAll(),
        //         pharmaForm: await PharmaForm.findAll(),
        //         comercialMedicine: await ComercialMedicine.findAll()
        //     });
        // }

        // res.render('medicine-new', { 
        //     medicine
        // });

        // res.json({
        //     data:medicine,  
        //     concentratedMedicine: await ConcentratedMedicine.findAll(),
        //     quantityMed: await QuantityMed.findAll(),
        //     pharmaForm: await PharmaForm.findAll(),
        //     comercialMedicine: await ComercialMedicine.findAll()
        // });
        res.json({medicine})
    } catch (error) {
        httpError(res, error);
    }
}

async function getListAllMedicines(req, res){
    try {
        const medicine = await Medicine.findAll({
            include: [
                {
                    model: ConcentratedMedicine,
                    as: 'ConcentratedMedicine'
                },
                {
                    model: QuantityMed,
                    as: 'QuantityMed'
                },
                {
                    model: PharmaForm,
                    as: 'PharmaForm'
                },
                {
                    model: ComercialMedicine,
                    as: 'ComercialMedicine'
                }
            ]
        });

        res.render('medicine-landing', { 
            medicines: medicine
        });       
       //res.json({data:medicine})

    } catch(error) {
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
        const { name, code, checkActive, items } = req.body;
        console.log("Body", req.body);
        console.log("Create medicine");

        const itemsJson = JSON.parse(items);
        const newMedicine = await Medicine.create({
            name,
            code,
            active: checkActive === 'Activo',
            creationDate: Date.now(),
            modificationDate: Date.now()
        }, { transaction });

        await processItems(itemsJson, newMedicine, transaction);

        await transaction.commit();
        console.log("Create medicine successfully");
        res.status(200).json({ message: "Create medicine successfully", data: newMedicine });

    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function updateMedicine(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const { id, name, code, checkActive, items } = req.body;
        console.log("Body", req.body);
        console.log("Update medicine");

        const itemsJson = JSON.parse(items);
        await Medicine.update({
            name,
            code,
            active: checkActive === 'Activo',
            modificationDate: Date.now(),
        }, { where: { id }, transaction });

        const updatedMedicine = await Medicine.findByPk(id);
        await processItems(itemsJson, updatedMedicine, transaction);

        await transaction.commit();
        console.log("Update medicine successfully");
        res.status(200).json({ message: "Update medicine successfully", data: updatedMedicine });

    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function findOrCreateEntity(model, findWhere, createData, transaction) {
    let entity = await model.findOne({ where: findWhere, transaction });
    if (!entity) {
        entity = await model.create({ ...createData, creationDate: Date.now(), modificationDate: Date.now() }, { transaction });
    }
    return entity;
}

async function processItems(itemsJson, medicine, transaction) {
    for (const element of itemsJson) {
        const familyMedicine = await findOrCreateEntity(FamilyMedicine, { name: element.familyMedicineName }, { name: element.familyMedicineName }, transaction);
        const comercialMedicine = await findOrCreateEntity(ComercialMedicine, { name: element.comercialName }, { name: element.comercialName }, transaction);
        const concentratedMedicine = await findCancelableEntity(ConcentratedMedicine, { magnitude: element.magnitude, quantity: element.quantityId }, {
            quantity: element.quantityId,
            magnitude: element.magnitude
        }, transaction);

        await medicine.addConcentratedMedicine(concentratedMedicine.id, { transaction });
        await medicine.addQuantityMed(element.quantityMedList, { transaction });
        await medicine.addPharmaForm(element.pharmaTypeId, { transaction });
        await medicine.addFamilyMedicine(familyMedicine.id, { transaction });
        await medicine.addComercialMedicine(comercialMedicine.id, { transaction });
    }
}

// async function createMedicine(req, res) {
//     const transaction = await sequelize.transaction();
//     try {
//         const {
//             name,
//             code,
//             checkActive,
//             items
//         } = req.body;
//         console.log("Body", req.body)
//         console.log("Create medicine")

//         const itemsJson = JSON.parse(items);

//         const newMedicine = await Medicine.create({
//             name,
//             code,
//             active: checkActive==='Activo' ? true : false,
//             creatiionDate: Date.now(),
//             modificationDate: Date.now(),
//         }, { transaction });

//         for (const element of itemsJson) {

//             let familyMedicine = await FamilyMedicine.findOne({
//                 where: { name: element.familyMedicineName }
//             });
    
//             if (!familyMedicine) {
//                 familyMedicine = await FamilyMedicine.create({
//                     name: element.familyMedicineName,
//                     creatiionDate: Date.now(),
//                     modificationDate: Date.now()
//                 }, { transaction })
//             }

//             let comercialMedicine = await ComercialMedicine.findOne({
//                 where: { name: element.comercialName }
//             })
    
//             if (!comercialMedicine) {
//                 comercialMedicine = await ComercialMedicine.create({
//                     name: element.comercialName,
//                     creatiionDate: Date.now(),
//                     modificationDate: Date.now()
//                 }, { transaction })
//             }

//             let concentratedMedicine = await ConcentratedMedicine.findOne({
//                 where: { 
//                     magnitude: element.magnitude, 
//                     quantity: element.quantityId }
//             });

//             if (!concentratedMedicine) {
//                 concentratedMedicine = await ConcentratedMedicine.create({
//                     quantity: element.quantityId,
//                     magnitude: element.magnitude,
//                     creationDate: Date.now(),
//                     modificationDate: Date.now()
//                 }, { transaction })
//             }

//             await newMedicine.addConcentratedMedicine(concentratedMedicine.id, { transaction });
//             await newMedicine.addQuantityMed(element.quantityMedList, { transaction });
//             await newMedicine.addPharmaForm(element.pharmaTypeId, { transaction });
//             await newMedicine.addFamilyMedicine(familyMedicine.id, { transaction });
//             await newMedicine.addComercialMedicine(comercialMedicine.id, { transaction });
//         };

//         await transaction.commit();
//         console.log("Create medicine successfully")
//         res.status(200).json({message: "Create medicine successfully", data: "newMedicine"});

//     } catch (error) {
//         await transaction.rollback();
//         httpError(res, error);
//     }
// }

// async function updateMedicine(req, res) {
//     const transaction = await sequelize.transaction();
//     try {
//         const { 
//             id,
//             name,
//             code,
//             checkActive,
//             items
//         } = req.body;
//         console.log("Body", req.body);
//         console.log("Update medicine");

//         const itemsJson = JSON.parse(items);

//         const updatedMedicine = await Medicine.update({
//             name,
//             code,
//             active: checkActive === 'Activo' ? true : false,
//             modificationDate: Date.now(),
//         }, { 
//             where: { id },
//             transaction 
//         });

//         for (const element of itemsJson) {
//             let familyMedicine = await FamilyMedicine.findOne({
//                 where: { name: element.familyMedicineValue },
//                 transaction
//             });

//             if (!familyMedicine) {
//                 familyMedicine = await FamilyMedicine.create({
//                     name: element.familyMedicineName,
//                     creationDate: Date.now(),
//                     modificationDate: Date.now()
//                 }, { transaction })
//             }

//             let comercialMedicine = await ComercialMedicine.findOne({
//                 where: { name: element.comercialName },
//                 transaction
//             });

//             if (!comercialMedicine) {
//                 comercialMedicine = await ComercialMedicine.create({
//                     name: element.comercialName,
//                     creationDate: Date.now(),
//                     modificationDate: Date.now()
//                 }, { transaction })
//             }

//             let concentratedMedicine = await ConcentratedMedicine.findOne({
//                 where: { 
//                     magnitude: element.magnitude, 
//                     quantity: element.quantityId 
//                 },
//                 transaction
//             });

//             if (!concentratedMedicine) {
//                 concentratedMedicine = await ConcentratedMedicine.create({
//                     quantity: element.quantityId,
//                     magnitude: element.magnitude,
//                     creationDate: Date.now(),
//                     modificationDate: Date.now()
//                 }, { transaction })
//             }

//             await updatedMedicine.addConcentratedMedicine(concentratedMedicine.id, { transaction });
//             await updatedMedicine.addQuantityMed(element.quantityMedList, { transaction });
//             await updatedMedicine.addPharmaForm(element.pharmaTypeId, { transaction });
//             await updatedMedicine.addFamilyMedicine(familyMedicine.id, { transaction });
//             await updatedMedicine.addComercialMedicine(comercialMedicine.id, { transaction });
//         };

//         await transaction.commit();
//         console.log("Update medicine successfully");
//         res.status(200).json({message: "Update medicine successfully", data: updatedMedicine});

//     } catch (error) {
//         await transaction.rollback();
//         httpError(res, error);
//     }
// }

async function deleteMedicine(req, res) {
    const { id } = req.params; 
    const transaction = await sequelize.transaction();

    try {        
        await Medicine.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();
        
        res.status(200).json( {id} );
    } catch (error) {
       
        await transaction.rollback();
        httpError(res, error);
    }
}

module.exports = { getMedicineById, getListAllMedicines, newMedicine, createMedicine, deleteMedicine, updateMedicine}