
const mongoose = require('mongoose');
const Vehicle = require('../src/models/Vehicle');


async function updateVehicle(id, updateData) {

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Vehicle not found');
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedVehicle) {
        throw new Error('Vehicle not found');
    }

    return updatedVehicle;
}

module.exports = updateVehicle;
