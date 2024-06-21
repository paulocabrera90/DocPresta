function mapUserData(userData) {
    return {
        id: userData.id,
        fullname: userData.fullname,
        rol: userData.rol,
        email: userData.email,
    }
}

module.exports = { mapUserData }