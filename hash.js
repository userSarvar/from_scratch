const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainPassword = 'promoterPassword2200';

async function hashPassword() {
    try {
        const hash = await bcrypt.hash(plainPassword, saltRounds);
        console.log('Hashed Password:', hash);
    } catch (error) {
        console.error('Error hashing password:', error);
    }
}

hashPassword();
