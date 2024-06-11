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
                    as: 'ConcentratedMedicine'
                }
            );

            Medicine.belongsToMany(
                models.QuantityMed, { 
                    through: 'QuantityMed_Medicine',
                    as: 'QuantityMed' 
                }
            );

            Medicine.belongsToMany(
                models.PharmaForm, 
                { through: 'PharmaForm_Medicine',
                    as: 'PharmaForm' }
                
            );

            Medicine.belongsTo(models.ComercialMedicine, {
                foreignKey: {
                  name: 'comercialMedicineId',
                  allowNull: false,
                  unique: true,
                },
                as: 'ComercialMedicine',
            });
        
              
            models.ComercialMedicine.hasOne(Medicine, {
                foreignKey: 'comercialMedicineId',
                as: 'Medicine',
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

