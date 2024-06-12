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
            type: DataTypes.STRING,
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

