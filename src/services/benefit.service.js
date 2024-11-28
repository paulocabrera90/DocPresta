const { Benefit, Section, sequelize } = require('../models/index.models');

async function getListAllBenefitsService() {
    return Benefit.findAll({
        include: [
            {
                model: Section,
                as: 'Sections'
            }
        ]
    });
}

async function getFindAllSections() {
    return Section.findAll();
}

async function createBenefitService(benefitData) {
    const transaction = await sequelize.transaction();
    try {
        const newBenefit = await Benefit.create(benefitData);
        await transaction.commit();
        return newBenefit;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    getListAllBenefitsService,
    getFindAllSections,
    createBenefitService
};