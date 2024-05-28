'use strict';
const {
  Model
} = require('sequelize');
        module.exports = (sequelize, DataTypes) => {
    class Medicine extends Model {} //agregar las relaciones con medicamentos

    Medicine.init({
        name: {
            type: DataTypes.STRING,
            defaultValue: true,
        },
        code: {
            type: DataTypes.STRING,
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

