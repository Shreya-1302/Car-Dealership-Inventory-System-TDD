const Vehicle = require('../src/models/Vehicle');

async function searchVehicles({ make, model, category, minPrice, maxPrice }) {
    const query = {};

    if (make) {
        query.make = { $regex: make, $options: 'i' };
    }
    if (model) {
        query.model = { $regex: model, $options: 'i' };
    }
    if (category) {
        query.category = { $regex: category, $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) {
            query.price.$gte = minPrice;
        }
        if (maxPrice !== undefined) {
            query.price.$lte = maxPrice;
        }
    }
    return await Vehicle.find(query);
}
module.exports = searchVehicles;

