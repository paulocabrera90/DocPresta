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

        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        // if (!medicine) {
        //     return res.render('medicine-new', { 
        //         medicine: ''
        //     });
        // }

        // res.render('medicine-new', { 
        //     medicine
        // });

        res.json({data:medicine,  
            concentratedMedicine: await ConcentratedMedicine.findAll(),
            quantityMed: await QuantityMed.findAll(),
            pharmaForm: await PharmaForm.findAll(),
            comercialMedicine: await ComercialMedicine.findAll()
        });

    } catch (error) {
        httpError(res, error);
    }
}

async function getListAllMedicines(req, res){
    try {
        const medicine = await Medicine.findAll({
            where: { state: true },
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
        const {
            name,
            code,
            comercialName,
            pharmaForm,
            familyMedicineName,
            checkActive,
            concentratedMedicineNameList,
            concentratedMedicineQuantityList,
            quantityMedList,
            pharmaFormList,
        } = req.body;
        console.log("Body", req.body)
        console.log("Create medicine")

        // let familyMedicine = await FamilyMedicine.findOne({
        //     where: { name: familyMedicineName }
        // });

        // if (!familyMedicine) {
        //     familyMedicine = await FamilyMedicine.create({
        //         name: familyMedicineName,
        //         creatiionDate: Date.now(),
        //         modificationDate: Date.now()
        //     }, { transaction })
        // }

        // let comercialMedicine = await ComercialMedicine.findOne({
        //     where: { name: comercialName }
        // })

        // if (!comercialMedicine) {
        //     comercialMedicine = await ComercialMedicine.create({
        //         name: comercialName,
        //         creatiionDate: Date.now(),
        //         modificationDate: Date.now()
        //     }, { transaction })
        // }

        // const newMedicine = await Medicine.create({
        //     name,
        //     code,
        //     comercialName,
        //     pharmaForm,
        //     familyMedicineId: familyMedicine.id,
        //     active: checkActive ? true : false,
        //     creatiionDate: Date.now(),
        //     modificationDate: Date.now(),
        //     comercialMedicineId: comercialMedicine.id
        // }, { transaction });

        // let concentratedMedicine = await ConcentratedMedicine.findOne({
        //     where: { magnitude: concentratedMedicineName, id: concentratedMedicineQuantityId }
        // });

        // if (!concentratedMedicine) {
        //     concentratedMedicine = await ConcentratedMedicine.create({
        //         name: concentratedMedicineName,
        //         quantity: Number(concentratedMedicineQuantityId),
        //         creatiionDate: Date.now(),
        //         modificationDate: Date.now()
        //     }, { transaction })
        // }

        // await newMedicine.addConcentratedMedicine(concentratedMedicine.id, { transaction });
        // await newMedicine.addQuantityMed(quantityMedId, { transaction });
        // await newMedicine.addPharmaForm(pharmaFormId, { transaction });

        // await transaction.commit();
        console.log("Create medicine successfully")
        res.status(200).json({message: "Create medicine successfully", data: "newMedicine"});

    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

async function associateMedicineAndConcentrate() {
    try {
      const { newMedicine, newConcentratedMedicine } = await createInstances();
  
      // Añadir la medicina concentrada a la medicina
      await newMedicine.addConcentratedMedicine(newConcentratedMedicine);
  
      console.log(`Medicina y medicina concentrada asociadas exitosamente.`);
    } catch (error) {
      console.error('Error asociando medicinas:', error);
    }
  }

async function updateMedicine(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const {id} = req.params;
        const {
            firstName, lastName, birthDate, numberDocument, 
            typeDocument, sex, planOSId, username, email
        } = req.body;

        console.log("req.body update", req.body);

        const existingMedicine = await Medicine.findOne({
            where: { id }
        }, { transaction });

        if (!existingMedicine) {
            throw new Error('Medicine not found');
        }

        const existingUser = await User.findOne({
            where: { id: existingMedicine.userId }
        }, { transaction });

        if (!existingUser) {
            throw new Error('User not found');
        }

        await User.update({
            username,
            email,
            modificationDate: Date.now(),
        }, {
            where: { id: existingUser.id },
            transaction
        });

        const existingPerson = await Person.findOne({
            where: { id: existingUser.personId }
        }, { transaction });

        if (!existingPerson) {
            throw new Error('Person not found');
        }

        await Person.update({
            firstName,
            lastName,
            birthDate,
            numberDocument,
            typeDocument,
            sex,
            modificationDate: Date.now(),
        }, {
            where: { id: existingPerson.id , numberDocument: existingPerson.numberDocument},
            transaction
        });       

        await Medicine.update({
            planOSId,
            modificationDate: Date.now(),
        }, {
            where: { userId: existingUser.id, id },
            transaction
        });

        await transaction.commit();
        console.log("Updated for medicine successfully")
        res.json({message: "Updated for medicine successfully"});

    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
    }
}

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