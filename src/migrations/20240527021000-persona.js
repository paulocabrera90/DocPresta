'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('personas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      apellido: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fechaNacimiento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      numeroDocumento: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      tipoDocumento: {
        type: Sequelize.ENUM('DNI', 'Pasaporte', 'Otro'),
        allowNull: false,
      },
      sexo: {
        type: Sequelize.ENUM('Masculino', 'Femenino', 'Otro'),
        allowNull: false,
      },
      estado: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      fechaCreacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      fechaModificacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('personas');
  }
};
