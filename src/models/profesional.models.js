'use strict';
const {
  Model
} = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
  class Profesional extends Model {
    static associate(models) {

      Profesional.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
          unique: true,
        },
        as: 'Users',
      });
    
      models.User.hasOne(Profesional, {
        foreignKey: 'userId',
        as: 'Profesionals',
      });
    
    
      Profesional.belongsTo(models.Speciality, {
        foreignKey: {
          name: 'specialityId',
          allowNull: false,
          unique: true,
        },
        as: 'Speciality',
      });
    
      models.Speciality.hasOne(Profesional, {
        foreignKey: 'specialityId',
        as: 'Profesionals',
      });

    }
  }

  Profesional.init({
    legalAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    idREFEPS: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
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
    },
  }, {
    sequelize,
    modelName: 'Profesional',
    tableName: 'Profesionals',
    timestamps: false,
  });
  
  return Profesional
}
