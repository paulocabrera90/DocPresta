'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Medicine extends Model {

        static associate(models) {
            Medicine.belongsToMany(
                models.ConcentratedMedicine, {
                through: 'ConcentratedMedicine_Medicine',
                as: 'ConcentratedMedicines'
            });

            Medicine.belongsToMany(
                models.QuantityMed, {
                through: 'QuantityMed_Medicine',
                as: 'QuantityMeds'
            });

            Medicine.belongsToMany(
                models.PharmaForm,
                {
                    through: 'PharmaForm_Medicine',
                    as: 'PharmaForms'
                });

            Medicine.belongsToMany(
                models.ComercialMedicine,
                {
                    through: 'ComercialMedicine_Medicine',
                    as: 'ComercialMedicines',
                });

            Medicine.belongsToMany(
                models.FamilyMedicine,
                {
                    through: 'FamilyMedicine_Medicine',
                    as: 'FamilyMedicines',
                });
        }
    }

    Medicine.init({
        name: {
            type: DataTypes.STRING,
            defaultValue: true,
        },
        code: {
            type: DataTypes.STRING,
            defaultValue: true,
            unique: true,
        },
        state: { //ACTIVO O NO
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        creationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        modificationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    }, {
        sequelize,
        modelName: 'Medicine',
        tableName: 'Medicines',
        timestamps: false,
    });

    return Medicine;
}

