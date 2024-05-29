const { httpError } = require('../helpers/handleError')
const userModel = require('../models/user.models')
const userService = require('../services/user.service');

async function getUsers (req, res) {
    try {
        const users = await userService.findAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar todos los usuarios' });
    }
}

async function getUser(req, res) {

}

async function updateUser(req, res) {

}

async function deleteUser(req, res) {
    const id = req.params.id;
    try {
        
        const deletedUser = await userModel.deleteOne({ _id: id });
        if (deletedUser.deletedCount === 1) {
            res.status(200).send({ data: "User delete successfully" });
        } else {
            res.status(404).send({ error: "User not found." });
        }
    } catch (e) {
        httpError(res, e)
    }
}

module.exports = { 
    getUser, 
    getUsers, 
    deleteUser,
    updateUser 
}