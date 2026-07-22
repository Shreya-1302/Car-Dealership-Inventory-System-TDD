const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const addVehicle = require('../../services/addvehicle');
const Vehicle = require('../../src/models/Vehicle');
const expectCookies = require('supertest/lib/cookies');

describe('addVehicle service', () => {
    let mongoServer;
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    })
    beforeEach(async () => {
        await Vehicle.deleteMany({});
    })

    it('should create a vehicle when all fields are valid', async () => {
        const vehicleData = {
            make: 'Toyota',
            model: 'Camry',
            category: 'Sedan',
            price: 25000,
            quantity: 5
        }

        const vehicle = await addVehicle(vehicleData);
        expect(vehicle).toBeDefined();
        expect(vehicle._id).toBeDefined();
        expect(vehicle.make).toBe('Toyota');
        expect(vehicle.model).toBe('Camry');
        expect(vehicle.category).toBe('Sedan');
        expect(vehicle.price).toBe(25000);
        expect(vehicle.quantity).toBe(5);

        const dbVehicle = await Vehicle.findById(vehicle._id);
        expect(dbVehicle).toBeDefined();
        expect(dbVehicle.make).toBe('Toyota');
    })

    it('should throw an error if a required field is missing', async () => {
        await expect(addVehicle({
            model: 'Camry',
            category: 'Sedan',
            price: 25000,
            quantity: 5
        })).rejects.toThrow('All fields are required');
        await expect(addVehicle({
            make: 'Toyota',
            model: 'Camry',
            category: 'Sedan',
            quantity: 5
        })).rejects.toThrow('All fields are required');

    })
})