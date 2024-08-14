// utils/auth.js

const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    hashPassword: (password, callback) => {
        bcrypt.hash(password, saltRounds, callback);
    },

    verifyPassword: (password, hash, callback) => {
        bcrypt.compare(password, hash, callback);
    }
};
