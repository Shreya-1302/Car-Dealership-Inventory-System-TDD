
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const deleteVehicle = require('../../services/deletevehicle');
const Vehicle = require('../../src/models/Vehicle');

describe('deleteVehicle service', () => {
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

    it('should delete a vehicle for a valid vehicle ID', async () => {
        const vehicle = await Vehicle.create({
            make: 'Toyota',
            model: 'Camry',
            category: 'Sedan',
            price: 25000,
            quantity: 5
        });

        const deleted = await deleteVehicle(vehicle._id);

        expect(deleted).toBeDefined();
        expect(deleted._id.toString()).toBe(vehicle._id.toString());

        // Verify it was deleted from the database
        const dbVehicle = await Vehicle.findById(vehicle._id);
        expect(dbVehicle).toBeNull();
    });

    it('should throw an error for a non-existent vehicle ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await expect(deleteVehicle(nonExistentId))
            .rejects.toThrow('Vehicle not found');
    });

    it('should throw an error if the ID is missing or invalid', async () => {

        await expect(deleteVehicle(null))
            .rejects.toThrow('Vehicle not found');

        await expect(deleteVehicle('invalid-id-format'))
            .rejects.toThrow('Vehicle not found');
    });
});
