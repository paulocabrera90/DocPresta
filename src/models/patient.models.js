
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      // define association here
      Patient.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
          unique: true,
        },
        as: 'Users',
      });
    
      models.User.hasOne(Patient, {
        foreignKey: 'userId',
        as: 'Patients',
      });
    
      Patient.belongsTo(models.PlanOS, {
          foreignKey: {
            name: 'planOSId',
            allowNull: false,
            unique: true,
          },
          as: 'PlanesOS',
        });
        
        models.PlanOS.hasOne(Patient, {
          foreignKey: 'planOSId',
          as: 'Patients',
        });
    }
  }

  Patient.init({
      state: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
      },
      dateCreation: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
      },
      dateModification: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
      }
  }, {
    sequelize,
    modelName: 'Patient',
    tableName: 'Patients',
    timestamps: false,
  })

  return Patient
}