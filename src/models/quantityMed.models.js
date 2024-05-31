'use strict';
const {
  Model
} = require('sequelize');
        module.exports = (sequelize, DataTypes) => {
    class QuantityMed extends Model {

        static associate(models) {
            QuantityMed.belongsToMany(
                models.Medicine, 
                { through: 'QuantityMed_Medicine' }
            );
        }

    } 

    QuantityMed.init({    
        quantity: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Unidad de Medida, o cantidad de medicamentos. Ejemplo: 14unidades'
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
    modelName: 'QuantityMed',
    tableName: 'QuantityMeds',
    timestamps: false,
    });

    return QuantityMed;
}

