const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const purchaseVehicle = require('../../services/purchasevehicles');
const Vehicle = require('../../src/models/Vehicle');
describe('purchaseVehicle service', () => {
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
    it('should decrease the vehicle quantity by 1 for a successful purchase', async () => {
        const vehicle = await Vehicle.create({
            make: 'Toyota',
            model: 'Camry',
            category: 'Sedan',
            price: 25000,
            quantity: 5
        })

        const updated = await purchaseVehicle(vehicle._id);

        expect(updated).toBeDefined();
        expect(updated.quantity).toBe(4);

        const dbVehicle = await Vehicle.findById(vehicle._id);
        expect(dbVehicle.quantity).toBe(4);
    })
    it('should throw "Insufficient stock" if the quantity is already 0', async () => {
        const vehicle = await Vehicle.create({
            make: 'Toyota',
            model: 'Camry',
            category: 'Sedan',
            price: 25000,
            quantity: 0
        });
        await expect(purchaseVehicle(vehicle._id)).rejects.toThrow('Insufficient stock');

        const dbVehicle = await Vehicle.findById(vehicle._id);
        expect(dbVehicle.quantity).toBe(0);
    });
    it('should throw "Vehicle not found" for a non-existent vehicle ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await expect(purchaseVehicle(nonExistentId)).rejects.toThrow('Vehicle not found');
    });
})
