'use strict';
const {
  Model
} = require('sequelize');
        module.exports = (sequelize, DataTypes) => {
    class Section extends Model {}

    Section.init({
        name: {
            type: DataTypes.STRING,
            defaultValue: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        state: {
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
    modelName: 'Section',
    tableName: 'Sections',
    timestamps: false,
    });

    return Section;
}

