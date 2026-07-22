const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
async function registerUser({ email, password, role }) {
    if (!email || !password || email.trim() === '' || password.trim() === '') {
        throw new Error('Email and password are required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
        email: normalizedEmail
    });
    if (existingUser) {
        throw new Error('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email: normalizedEmail,
        password: hashedPassword,
        role: role || 'user',
    });
    return await newUser.save();
}
module.exports = registerUser;