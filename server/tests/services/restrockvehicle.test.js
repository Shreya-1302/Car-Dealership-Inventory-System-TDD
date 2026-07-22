const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const restockVehicle = require('../../services/restockvehicle');
const Vehicle = require('../../src/models/Vehicle');
describe('restockVehicle service', () => {
    let mongoServer;
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });
    beforeEach(async () => {
        await Vehicle.deleteMany({});
    });
    it('should increase the vehicle quantity by the given positive integer amount', async () => {
        const vehicle = await Vehicle.create({
            make: 'Toyota',
            model: 'Camry',
            category: 'Sedan',
            price: 25000,
            quantity: 5
        })
        const updated = await restockVehicle(vehicle._id, 10);

        expect(updated).toBeDefined();
        expect(updated.quantity).toBe(15);
        const dbVehicle = await Vehicle.findById(vehicle._id);
        expect(dbVehicle.quantity).toBe(15);
    })
    it('should throw an error if the quantity is neagtive,zero or not a whole no', async () => {
        const vehicle = await Vehicle.create({
            make: 'Toyota',
            model: 'Camry',
            category: 'Sedan',
            price: 25000,
            quantity: 5
        });
        await expect(restockVehicle(vehicle._id, -5)).rejects.toThrow('Invalid quantity');

        await expect(restockVehicle(vehicle._id, 0)).rejects.toThrow('Invalid quantity');

        await expect(restockVehicle(vehicle._id, 2.5)).rejects.toThrow('Invalid quantity');

        await expect(restockVehicle(vehicle._id, 'ten')).rejects.toThrow('Invalid quantity');
    });

    it('should throw "vehicle not found" for non-existent vehicle id', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await expect(restockVehicle(nonExistentId, 5)).rejects.toThrow('Vehicle not found');
    })
})
