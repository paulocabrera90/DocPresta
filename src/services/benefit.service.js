const { Benefit, Section, Prescription, sequelize } = require('../models/index.models');

async function getListAllBenefitsService() {
    return Benefit.findAll({
        include: [{ model: Section, as: 'Sections' }]
    });
}

async function getFindAllSections() {
    return Section.findAll();
}

async function createBenefitService(benefitData) {
    const transaction = await sequelize.transaction();
    try {
        const { name, code, sectionId, description, justification, state, creationDate, modificationDate } = benefitData;
      
        const booleanState = state === "1";

        const newBenefit = await Benefit.create({
            name,
            code,
            sectionId,
            description,
            justification,
            state: booleanState,
            creationDate,
            modificationDate
        });

        await transaction.commit();
        return newBenefit;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function updateBenefitService(id, benefitData) {
    const transaction = await sequelize.transaction();
    try {
        
        const { name, code, sectionId, description, justification, state, creationDate, modificationDate } = benefitData;

        const booleanState = state === "1";

        await Benefit.update({
            name,
            code,
            sectionId,
            description,
            justification,
            state: booleanState,
            creationDate,
            modificationDate
        }, {
            where: { id },
            transaction
        });

        const updatedBenefit = await Benefit.findByPk(id, {
            include: [{ model: Section, as: 'Sections' }],
            transaction
        });

        if (!updatedBenefit) {
            throw new Error('Medicine not found');
        }       

        await transaction.commit();
        return updatedBenefit;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function getFindBenefitByIdService(id) {
    const benefit = await Benefit.findOne({
        where: { id },
        include: [{ model: Section, as: 'Sections' }]
    });

    const sections = await getFindAllSections();

    if (!benefit) {
        return { benefit: '' , sections };
    }

    return { benefit, sections };
}

async function deleteBenefitService(id) {
    const transaction = await sequelize.transaction();
    try {
        const benefit = await Benefit.findByPk(id, {
            include: [{ model: Section, as: 'Sections' }],
            transaction
        });
    
        if (!benefit) {
            throw new Error('Prestación no encontrado.');
        }

        const prescriptionCount = await Prescription.count({
            where: { benefitId: id },
            transaction
        });

        if (prescriptionCount > 0) {
            throw new Error('No se puede eliminar la prestación porque está siendo usado por una o más prescripciones.');
        }
    
        await Benefit.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();
    
        return id;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    getListAllBenefitsService,
    getFindAllSections,
    createBenefitService,
    getFindBenefitByIdService,
    updateBenefitService,
    deleteBenefitService
};