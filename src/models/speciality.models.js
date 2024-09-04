'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Speciality extends Model {
      static associate(models) {

        Speciality.belongsTo(models.Profesion, {
          foreignKey: {
            name: 'profesionId',
            allowNull: false
          },
          as: 'Profesion',
        });
    
      }

    }

    Speciality.init({
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
        }
    }, {
      sequelize,
      modelName: 'Speciality',
      tableName: 'Specialities',
      timestamps: false,
    });

    return Speciality;
}
