
const mongoose = require('mongoose');
const Vehicle = require('../src/models/Vehicle');
async function deleteVehicle(id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Vehicle not found');
    }
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);
    if (!deletedVehicle) {
        throw new Error('Vehicle not found');
    }
    return deletedVehicle;
}
module.exports = deleteVehicle;
