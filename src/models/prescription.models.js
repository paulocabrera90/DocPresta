'use strict';
const {
  Model
} = require('sequelize');
        module.exports = (sequelize, DataTypes) => {
    class Prescription extends Model {

        static associate(models) {
          
            Prescription.belongsToMany(models.Benefit, {
                through: 'Prescription_Benefit',
                as: 'Benefits',
                foreignKey: 'prescriptionId'
            });
            
            Prescription.belongsToMany(models.Medicine, {
                through: 'Prescription_Medicine',
                as: 'Medicines',
                foreignKey: 'prescriptionId'
            });

            Prescription.belongsTo(models.Patient, {
                foreignKey: 'patientId',
                as: 'Patients',
            });

            Prescription.belongsTo(models.Sickness, {
                foreignKey: 'sicknessId',
                as: 'Sicknesses',
            });

            Prescription.belongsTo(models.Profesional, {
                foreignKey: 'profesionalId',
                as: 'Profesionals',
            });            
        }
    }

    Prescription.init({
        prescriptionDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        validate: {
            type: DataTypes.STRING,
            allowNull: false
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
        benefitDescription: {
            type: DataTypes.STRING
        }
    }, {
    sequelize,
    modelName: 'Prescription',
    tableName: 'Prescriptions',
    timestamps: false,
    });

    return Prescription;
}

