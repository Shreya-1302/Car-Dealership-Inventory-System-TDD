
const Vehicle = require('../src/models/Vehicle');

function viewAllVehicles() {
    return Vehicle.find({});
}

module.exports = viewAllVehicles;
