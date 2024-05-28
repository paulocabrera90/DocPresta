'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profesion extends Model {
    static associate(models) {}
  }

  Profesion.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    description:{
      type: DataTypes.STRING,
      allowNull: true
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
    },
  }, {
    sequelize,
    modelName: 'Profesion',
    tableName: 'Profesions',
    timestamps: false, // Desactiva timestamps automáticos de Sequelize
    hooks: {
      beforeUpdate: (Profesion, options) => {
        Profesion.fechaModificacion = new Date();
      },
    },
  });
 return Profesion
}