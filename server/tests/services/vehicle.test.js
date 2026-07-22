
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const Vehicle = require('../../src/models/Vehicle');

describe('Vehicle Routes Integration', () => {
    let mongoServer;
    let userToken;
    let adminToken;
    const JWT_SECRET = 'test_secret_for_testing';

    beforeAll(async () => {
        process.env.JWT_SECRET = JWT_SECRET;
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);

        // Pre-generate auth tokens for the tests
        userToken = jwt.sign({ userId: new mongoose.Types.ObjectId().toString(), role: 'user' }, JWT_SECRET);
        adminToken = jwt.sign({ userId: new mongoose.Types.ObjectId().toString(), role: 'admin' }, JWT_SECRET);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Vehicle.deleteMany({});
    });

    // Verify 401 Unauthorized when no token is present
    it('should return 401 if request does not contain a token', async () => {
        const res = await request(app).get('/api/vehicles');
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'Access denied. No token provided.');
    });

    // POST /api/vehicles
    describe('POST /api/vehicles', () => {
        it('should allow user/admin to create a vehicle with valid fields', async () => {
            const res = await request(app)
                .post('/api/vehicles')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    make: 'Toyota',
                    model: 'Camry',
                    category: 'Sedan',
                    price: 25000,
                    quantity: 5
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.make).toBe('Toyota');
        });

        it('should return 400 if a required field is missing', async () => {
            const res = await request(app)
                .post('/api/vehicles')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    model: 'Camry',
                    category: 'Sedan'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    // GET /api/vehicles
    describe('GET /api/vehicles', () => {
        it('should return all vehicles', async () => {
            await Vehicle.create({ make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 3 });

            const res = await request(app)
                .get('/api/vehicles')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].make).toBe('Honda');
        });
    });

    // GET /api/vehicles/search
    describe('GET /api/vehicles/search', () => {
        it('should return matching vehicles', async () => {
            await Vehicle.create({ make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 3 });

            const res = await request(app)
                .get('/api/vehicles/search?make=honda')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].make).toBe('Honda');
        });
    });

    // PUT /api/vehicles/:id
    describe('PUT /api/vehicles/:id', () => {
        it('should update the fields for a valid vehicle ID', async () => {
            const vehicle = await Vehicle.create({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 });

            const res = await request(app)
                .put(`/api/vehicles/${vehicle._id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ price: 26000 });

            expect(res.status).toBe(200);
            expect(res.body.price).toBe(26000);
        });
    });

    // DELETE /api/vehicles/:id (Admin-only check)
    describe('DELETE /api/vehicles/:id', () => {
        it('should allow admin to delete a vehicle', async () => {
            const vehicle = await Vehicle.create({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 });

            const res = await request(app)
                .delete(`/api/vehicles/${vehicle._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Vehicle deleted successfully');

            const dbVehicle = await Vehicle.findById(vehicle._id);
            expect(dbVehicle).toBeNull();
        });

        it('should return 403 when a non-admin user tries to delete a vehicle', async () => {
            const vehicle = await Vehicle.create({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 });

            const res = await request(app)
                .delete(`/api/vehicles/${vehicle._id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('error', 'Access denied. Admin role required.');
        });
    });

    // POST /api/vehicles/:id/purchase
    describe('POST /api/vehicles/:id/purchase', () => {
        it('should decrease the quantity by 1', async () => {
            const vehicle = await Vehicle.create({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 });

            const res = await request(app)
                .post(`/api/vehicles/${vehicle._id}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.vehicle.quantity).toBe(4);
        });
    });

    // POST /api/vehicles/:id/restock (Admin-only check)
    describe('POST /api/vehicles/:id/restock', () => {
        it('should allow admin to restock a vehicle', async () => {
            const vehicle = await Vehicle.create({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 });

            const res = await request(app)
                .post(`/api/vehicles/${vehicle._id}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ quantity: 5 });

            expect(res.status).toBe(200);
            expect(res.body.vehicle.quantity).toBe(10);
        });

        it('should return 403 when a non-admin user tries to restock a vehicle', async () => {
            const vehicle = await Vehicle.create({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 });

            const res = await request(app)
                .post(`/api/vehicles/${vehicle._id}/restock`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 5 });

            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('error', 'Access denied. Admin role required.');
        });
    });
});
