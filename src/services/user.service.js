const User = require('../models/user.models');

async function findAllUsers() {
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      throw new Error('Error al buscar todos los usuarios');
    }
  }

module.exports = { findAllUsers};
