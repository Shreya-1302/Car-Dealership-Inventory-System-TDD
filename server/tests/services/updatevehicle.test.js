const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const updateVehicle = require('../../services/updatevehicle');
const Vehicle = require('../../src/models/Vehicle');
describe('updateVehicle service', () => {
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
    it('should update fields for a valid vehicle ID', async () => {
        const vehicle = await Vehicle.create({
            make: 'Toyota',
            model: 'Camry',
            category: 'Sedan',
            price: 25000,
            quantity: 5
        });
        const updated = await updateVehicle(vehicle._id, {
            price: 26000,
            quantity: 4
        });
        expect(updated).toBeDefined();
        expect(updated.price).toBe(26000);
        expect(updated.quantity).toBe(4);
        expect(updated.make).toBe('Toyota');
        expect(updated.model).toBe('Camry');

        const dbVehicle = await Vehicle.findById(vehicle._id);
        expect(dbVehicle.price).toBe(26000);
        expect(dbVehicle.quantity).toBe(4);
    });
    it('should throw an error for a non-existent vehicle ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await expect(updateVehicle(nonExistentId, { price: 20000 }))
            .rejects.toThrow('Vehicle not found');
    });
    it('should throw an error if the ID is missing or invalid', async () => {

        await expect(updateVehicle(null, { price: 20000 }))
            .rejects.toThrow('Vehicle not found');

        await expect(updateVehicle('invalid-id-format', { price: 20000 }))
            .rejects.toThrow('Vehicle not found');
    });
});