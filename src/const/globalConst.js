require('dotenv').config()
const path = require('path')

module.exports = {
    PORT: process.env.PORT || 8000,
    DIRNAME: path.join('src/'),
    APPLICATION_NAME: process.env.APPLICATION_NAME,
    JOIN: path.join
}