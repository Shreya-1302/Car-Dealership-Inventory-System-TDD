const Vehicle = require('../src/models/Vehicle');

async function addVehicle({ make, model, category, price, quantity }) {
    if (!make || !model || !category || price === undefined || quantity === undefined) {
        throw new Error('All fields are required')
    }

    const newVehicle = new Vehicle({
        make,
        model,
        category,
        price,
        quantity
    });
    return await newVehicle.save();
}
module.exports = addVehicle;