'use strict';
const {
  Model
} = require('sequelize');
        module.exports = (sequelize, DataTypes) => {
    class PharmaForm extends Model {

        static associate(models) {
            PharmaForm.belongsToMany(
                models.Medicine, 
                { through: 'PharmaForm_Medicine' }
            );
        }

    } 

    PharmaForm.init({
        name: {
            type: DataTypes.ENUM('CAPSULA', 'GOTA', 'AMPOLLA', 'JARABE', 'COMPRIMIDO', 'OTROS'),
            allowNull: false
        },
        creationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
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
    modelName: 'PharmaForm',
    tableName: 'PharmaForms',
    timestamps: false,
    });

    return PharmaForm;
}

