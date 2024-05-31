'use strict';
const {
  Model
} = require('sequelize');
        module.exports = (sequelize, DataTypes) => {
    class ConcentratedMedicine extends Model {

        static associate(models) {
            ConcentratedMedicine.belongsToMany(
                models.Medicine, 
                { through: 'ConcentratedMedicine_Medicine' }
            );
        }

    } 

    ConcentratedMedicine.init({
        quantity: {
            type: DataTypes.STRING,
            allowNull: false
        },
        magnitude: {
            type: DataTypes.ENUM('MG', 'G', 'ML', 'CM3'),
            allowNull: false
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
    modelName: 'ConcentratedMedicine',
    tableName: 'ConcentratedMedicines',
    timestamps: false,
    });

    return ConcentratedMedicine;
}

