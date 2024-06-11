const { Medicine, User, Person, ConcentratedMedicine, QuantityMed, PharmaForm, ComercialMedicine,sequelize } = require('../models/index.models');
const { mapMedicineData } = require('../models/mappers/medicine.mapper');
const { httpError } = require('../helpers/handleError');
const { encrypt } = require('../utils/handleBcrypt');

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
            pharmaForm: await PharmaForm.findAll()
        });
        
    } catch (error) {
        httpError(res, error);
    }
}


async function createMedicine(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const {firstName, lastName, birthDate, numberDocument, 
            typeDocument, sex, planOSId, passwordhash, 
            username, email
        } = req.body;
        console.log("req.body", req.body)
        console.log("Create medicine")

        const newPerson = await Person.create({
            firstName,
            lastName,
            birthDate,
            numberDocument,
            typeDocument,
            sex,
            state: true,
            creationDate: new Date(),
            ModificationDate: new Date()
        }, { transaction });

        const passwordEncrypted = await encrypt(passwordhash)

        const registerUser = await User.create({
            username,
            email,          
            hashPassword: passwordEncrypted,          
            profilePic: '',
            state: true,
            crationDate: Date.now(),
            modificationDate: Date.now(),
            rol: "PACIENTE",
            personId: newPerson.id
        }, { transaction })

        const medicine = await Medicine.create({
            userId: registerUser.id,
            planOSId, 
            creationDate: new Date(),
            modificationDate: new Date()
        }, { transaction });

         await transaction.commit();
        console.log("Create medicine successfully")
        res.status(200).json({message: "Create medicine successfully"});

    } catch (error) {
        await transaction.rollback();
        httpError(res, error);
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