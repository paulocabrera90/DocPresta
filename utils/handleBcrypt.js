const bcrypt = require('bcryptjs');

async function encrypt(textPlain) {
    const hash = await bcrypt.hash(textPlain, 10);
    return hash
}

async function compare(passwordPlain, hashPassword) {
    return await bcrypt.compare(passwordPlain, hashPassword);
}

module.exports = { encrypt, compare }