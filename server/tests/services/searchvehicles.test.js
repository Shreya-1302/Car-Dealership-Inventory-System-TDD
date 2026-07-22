const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const searchVehicles = require('../../services/searchvehicles');
const Vehicle = require('../../src/models/Vehicle');
describe('searchVehicles service', () => {
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


        await Vehicle.create([
            { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 },
            { make: 'Toyota', model: 'RAV4', category: 'SUV', price: 30000, quantity: 2 },
            { make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 3 },
            { make: 'Ford', model: 'F-150', category: 'Truck', price: 40000, quantity: 1 }
        ]);
    })
    it('should search by make alone ', async () => {
        const results = await searchVehicles({ make: 'toyota' });
        expect(results.length).toBe(2);
        expect(results.some(v => v.model === 'Camry')).toBe(true);
        expect(results.some(v => v.model === 'RAV4')).toBe(true);
    })
    it('should search by model alone (case-insensitive)', async () => {
        const results = await searchVehicles({ model: 'civic' });
        expect(results.length).toBe(1);
        expect(results[0].make).toBe('Honda');
    });

    it('should search by category alone', async () => {
        const results = await searchVehicles({ model: 'civic' });
        expect(results.length).toBe(1);
        expect(results[0].make).toBe('Honda');
    })

    it('should search by category alone (case-insensitive)', async () => {
        const results = await searchVehicles({ category: 'sedan' });
        expect(results.length).toBe(2);
        expect(results.every(v => v.category === 'Sedan')).toBe(true);
    });


    it('should search by price range (minPrice and maxPrice)', async () => {

        let results = await searchVehicles({ minPrice: 30000 });
        expect(results.length).toBe(2);

        results = await searchVehicles({ maxPrice: 25000 });
        expect(results.length).toBe(2);

        results = await searchVehicles({ minPrice: 23000, maxPrice: 35000 });
        expect(results.length).toBe(2);
    });


    it('should combine multiple filters', async () => {
        const results = await searchVehicles({
            make: 'toyota',
            category: 'sedan',
            maxPrice: 28000
        });
        expect(results.length).toBe(1);
        expect(results[0].model).toBe('Camry');
    })
    it('should return empty list when no matches are found', async () => {
        const results = await searchVehicles({ make: 'Tesla' });
        expect(results.length).toBe(0);
    });
})