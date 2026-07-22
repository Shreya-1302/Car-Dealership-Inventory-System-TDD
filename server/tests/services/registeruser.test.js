// server/tests/services/registeruser.test.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const registerUser = require('../../services/registeruser');
const User = require('../../src/models/User');

describe('registerUser service', () => {
    let mongoServer;

    // Start the database connection before running these tests
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    // Disconnect and stop the database after tests finish
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should create a user with hashed password', async () => {
        const userData = { email: 'test@example.com', password: 'password123', role: 'user' };
        const user = await registerUser(userData);
        expect(user).toBeDefined();
        expect(user.email).toBe('test@example.com');
        expect(user.password).not.toBe('password123');
        const isMatch = await bcrypt.compare('password123', user.password);
        expect(isMatch).toBe(true);

        const dbUser = await User.findOne({ email: 'test@example.com' });
        expect(dbUser).toBeDefined();
        expect(dbUser.email).toBe('test@example.com');
    });

    it('should reject a duplicate email', async () => {
        const userData = { email: 'duplicate@example.com', password: 'password123' };
        // first registration passes
        await registerUser(userData);
        // second registration should throw duplicate
        await expect(registerUser(userData)).rejects.toThrow('Email already in use');
    });

    it('should throw an error if fields are missing', async () => {
        await expect(registerUser({ email: '' })).rejects.toThrow('Email and password are required');
        await expect(registerUser({ password: 'password123' })).rejects.toThrow('Email and password are required');
        await expect(registerUser({})).rejects.toThrow('Email and password are required');
    });
});
