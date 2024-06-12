'use strict';
const {
  Model
} = require('sequelize');
    module.exports = (sequelize, DataTypes) => {

    class FamilyMedicine extends Model {
      static associate(models) {
        FamilyMedicine.belongsToMany(
          models.Medicine, 
          { through: 'FamilyMedicine_Medicine' }
        );
      }
    }

    FamilyMedicine.init({
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
      modelName: 'FamilyMedicine',
      tableName: 'FamilyMedicines',
      timestamps: false,
      hooks: {
        beforeUpdate: (FamilyMedicine, options) => {
            FamilyMedicine.fechaModificacion = new Date();
        },
      },
    });

    return FamilyMedicine;
  }