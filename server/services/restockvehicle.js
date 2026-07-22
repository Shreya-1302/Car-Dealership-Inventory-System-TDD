
const mongoose = require('mongoose');
const Vehicle = require('../src/models/Vehicle');

async function restockVehicle(id, quantity) {

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Vehicle not found');
    }

    if (quantity === undefined || typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
        throw new Error('Invalid quantity');
    }

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
        throw new Error('Vehicle not found');
    }

    vehicle.quantity += quantity;
    return await vehicle.save();
}

module.exports = restockVehicle;
