const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const viewAllVehicles = require('../../services/viewallvehicles');
const Vehicle = require('../../src/models/Vehicle');

describe('viewAllVehicles services', () => {
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

    it('should return all vehicles from the database', async () => {
        await Vehicle.create([
            { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 },
            { make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 3 }
        ])

        const vehicles = await viewAllVehicles();
        expect(vehicles).toBeDefined();
        expect(vehicles.length).toBe(2);
        expect(vehicles[0].make).toBe('Toyota');
        expect(vehicles[1].make).toBe('Honda');
    })

    it('should return an empty array if there are no vehicles', async () => {
        const vehicles = await viewAllVehicles();
        expect(vehicles).toBeDefined();
        expect(vehicles.length).toBe(0);
    })
})