const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');
const { register } = require('../../src/controllers/authcontrollers');
describe('Auth Route Flow', () => {
    let mongoServer;
    beforeAll(async () => {
        process.env.JWT_SECRET = 'test_secret_for_testing';
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });
    beforeEach(async () => {
        await User.deleteMany({});
    });
    it('should complete regstration,login,and access a protected route using the token', async () => {
        const email = 'flow_test@example.com';
        const password = 'password123';

        //register
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({ email, password });

        expect(registerRes.status).toBe(201);
        expect(registerRes.body).toHaveProperty('message', 'User registered successfully');

        //login
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email, password });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body).toHaveProperty('token');
        const token = loginRes.body.token;

        //proctected
        const protectedRes = await request(app)
            .get('/api/vehicles')
            .set('Authorization', `Bearer ${token}`);
        expect(protectedRes.status).toBe(200);
        expect(Array.isArray(protectedRes.body)).toBe(true);
    })
})