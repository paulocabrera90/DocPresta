'use strict';
const {
  Model
} = require('sequelize');
        module.exports = (sequelize, DataTypes) => {
    class Prescription extends Model {

        static associate(models) {
          
            Prescription.belongsTo(models.Benefit, {
                foreignKey: 'benefitId',
                as: 'Benefits'
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
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
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
    modelName: 'Prescription',
    tableName: 'Prescriptions',
    timestamps: false,
    });

    return Prescription;
}

