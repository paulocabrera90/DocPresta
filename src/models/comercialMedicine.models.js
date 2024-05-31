'use strict';
const {
  Model
} = require('sequelize');
    module.exports = (sequelize, DataTypes) => {
    class ComercialMedicine extends Model {
      static associate(models) {}
    }

    ComercialMedicine.init({
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      creationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      ModificationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, {
      sequelize,
      modelName: 'ComercialMedicine',
      tableName: 'ComercialMedicines',
      timestamps: false,
    });

    return ComercialMedicine;
  }