const { httpError } = require('../helpers/handleError')
const userModel = require('../models/user.models')

async function getUsers (req, res) {
    try {
        const listAll = await userModel.find({})
        res.send({ data: listAll })
    } catch (e) {
        httpError(res, e)
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