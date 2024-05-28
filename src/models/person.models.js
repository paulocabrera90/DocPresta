'use strict';
const {
  Model
} = require('sequelize');
    module.exports = (sequelize, DataTypes) => {

    class Person extends Model {
      static associate(models) {}
    }

    Person.init({
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      numberDocument: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      typeDocument: {
        type: DataTypes.ENUM('DNI', 'Pasaporte', 'Otro'),
        allowNull: false,
      },
      sex: {
        type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'),
        allowNull: false,
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
      ModificationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, {
      sequelize,
      modelName: 'Person',
      tableName: 'Persons',
      timestamps: false, // Desactiva timestamps automáticos de Sequelize
      hooks: {
        beforeUpdate: (Person, options) => {
          Person.fechaModificacion = new Date();
        },
      },
    });

    return Person;
  }