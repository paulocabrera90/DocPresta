require('dotenv').config()
const path = require('path')

module.exports = {
    PORT: process.env.PORT || 8000,
    DIRNAME: path.join('src/'),
    APPLICATION_NAME: process.env.APPLICATION_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    TIME_SESSION: process.env.TIME_SESSION,
    EXPIRATION_PROFESIONAL: process.env.EXPIRATION_PROFESIONAL,
    JOIN: path.join
}