'use strict';
const {
  Model
} = require('sequelize');
        module.exports = (sequelize, DataTypes) => {
    class Benefit extends Model {
        static associate(models) {

            Benefit.belongsTo(models.Section, {
                foreignKey: {
                  name: 'sectionId',
                  allowNull: false,
                  unique: true,
                },
                as: 'Section', // Nombre del alias para la asociación
              });
        
              
              models.Section.hasOne(Benefit, {
                foreignKey: 'benefitId',
                as: 'Sections',
              });
           
        }
    }

    Benefit.init({
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
        justification:{
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
    modelName: 'Benefit',
    tableName: 'Benefits',
    timestamps: false,
    });

    return Benefit;
}

