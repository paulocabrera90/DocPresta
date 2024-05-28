'use strict';
const {
  Model
} = require('sequelize');
        module.exports = (sequelize, DataTypes) => {
    class SocialWork extends Model {}

    SocialWork.init({
        name: {
            type: DataTypes.STRING,
            defaultValue: true,
        },
        CUIT: {
            type: DataTypes.STRING,
            defaultValue: true,
            unique: true,
        },
        code: {
            type: DataTypes.STRING,
            defaultValue: true,
            unique: true,
        },
        status: {
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
    modelName: 'SocialWork',
    tableName: 'SocialWorks',
    timestamps: false,
    });

    return SocialWork;
}

