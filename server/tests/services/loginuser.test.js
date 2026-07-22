const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const loginUser = require('../../services/loginuser');
const registerUser = require('../../services/registeruser');
const User = require('../../src/models/User');


describe('loginUser service', () => {
    let mongoServer;
    beforeAll(async () => {
        process.env.JWT_SECRET = 'test_secret_for_testing';
        mongoServer = await MongoMemoryServer.create();
        const url = mongoServer.getUri();
        await mongoose.connect(url);
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    })

    beforeEach(async () => {
        await User.deleteMany({});
    });


    it('should return a JWT on correct email and password', async () => {
        const email = 'login_test@example.com';
        const password = 'password123';
        await registerUser({ email, password });

        const token = await loginUser({ email, password });
        expect(token).toBeDefined();

        //verify the jwt structure and details
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded).toHaveProperty('userId');
        expect(decoded).toHaveProperty('role', 'user');

        const dbUser = await User.findOne({ email });
        expect(decoded.userId).toBe(dbUser._id.toString());
    });

    it('should throw an error on wrong password', async () => {
        const email = 'login_test@example.com';
        const password = 'password123'
        await registerUser({ email, password })

        await expect(loginUser({ email, password: 'wrongpassword' })).rejects.toThrow('Invalid email or password');

    })

    it('should throw an error on unknown email', async () => {
        await expect(loginUser({ email: 'unknown@example.com', password: 'password123' })).rejects.toThrow('Invalid email or password')
    })
})