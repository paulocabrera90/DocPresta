const { Benefit, Section, sequelize } = require('../models/index.models');

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

        // Convertir el valor de state de "1" o "0" a booleano
        const booleanState = state === "1";

        const newBenefit = await Benefit.create({
            name,
            code,
            sectionId,
            description,
            justification,
            state: booleanState, // Usa el valor booleano aquí
            creationDate,
            modificationDate
        });

       // const newBenefit = await Benefit.create(benefitData);
        await transaction.commit();
        return newBenefit;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function getFindBenefitByIdService(id) {
    const benefit = await Benefit.findOne({
        where: { id },
        include: [
            { model: Section, as: 'Sections' }
        ]
    });

    const sections = await getFindAllSections();

    if (!benefit) {
        return { benefit: '' , sections };
    }

    return { benefit, sections };
}

module.exports = {
    getListAllBenefitsService,
    getFindAllSections,
    createBenefitService,
    getFindBenefitByIdService
};