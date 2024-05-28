
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) { 

      User.belongsTo(models.Person, {
        foreignKey: {
          name: 'personId',
          allowNull: false,
          unique: true,
        },
        as: 'Person', // Nombre del alias para la asociación
      });

      
      models.Person.hasOne(User, {
        foreignKey: 'personId',
        as: 'Users',
      });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    hashPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.ENUM('ADMIN', 'PROFESIONAL', 'PACIENTE'),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
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
    modelName: 'User',
    tableName: 'Users',
    timestamps: false,
  });

  return User;
}