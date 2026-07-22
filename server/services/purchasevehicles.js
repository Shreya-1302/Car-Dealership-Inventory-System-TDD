const mongoose = require('mongoose');
const Vehicle = require('../src/models/Vehicle');

async function purchaseVehicle(id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Vehicle not found')
    }

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
        throw new Error('Vehicle not found')
    }

    if (vehicle.quantity <= 0) {
        throw new Error('Insufficient stock')
    }
    vehicle.quantity -= 1;
    return await vehicle.save();
}
module.exports = purchaseVehicle;