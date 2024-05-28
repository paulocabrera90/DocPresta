'use strict';
const {
  Model
} = require('sequelize');
        module.exports = (sequelize, DataTypes) => {
    class Sickness extends Model {}

    Sickness.init({
        name: {
            type: DataTypes.STRING,
            defaultValue: true,
        },
        code: {
            type: DataTypes.STRING,
            defaultValue: true,
        },
        description: {
            type: DataTypes.STRING,
            defaultValue: true,
        },
        treatment: {
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
    modelName: 'Sickness',
    tableName: 'Sicknesses',
    timestamps: false,
    });

    return Sickness;
}

