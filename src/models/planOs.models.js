'use strict';
const {
  Model
} = require('sequelize');
        module.exports = (sequelize, DataTypes) => {
    class PlanOS extends Model {
        static associate(models) {      
            PlanOS.belongsTo(models.SocialWork, {
              foreignKey: {
                name: 'socialWorkId',
                allowNull: false,
                unique: true,
              },
              as: 'socialWork', // Nombre del alias para la asociación
            });      
            
            models.SocialWork.hasOne(PlanOS, {
              foreignKey: 'socialWorkId',
              as: 'SocialWorks',
            });
          }
    }

    PlanOS.init({
        name: {
          type: DataTypes.STRING,
          defaultValue: true,
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
    modelName: 'PlanOS',
    tableName: 'PlanesOS',
    timestamps: false,
    });

    return PlanOS;
}

