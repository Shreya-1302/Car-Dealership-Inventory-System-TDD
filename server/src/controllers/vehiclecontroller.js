
const addVehicleService = require('../../services/addvehicle');
const viewAllVehiclesService = require('../../services/viewallvehicles');
const searchVehiclesService = require('../../services/searchvehicles');
const updateVehicleService = require('../../services/updatevehicle');
const deleteVehicleService = require('../../services/deletevehicle');
const purchaseVehicleService = require('../../services/purchasevehicles');
const restockVehicleService = require('../../services/restockvehicle');


exports.addVehicle = async (req, res) => {
    try {
        const vehicle = await addVehicleService(req.body);
        return res.status(201).json(vehicle);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


exports.getAll = async (req, res) => {
    try {
        const vehicles = await viewAllVehiclesService();
        return res.status(200).json(vehicles);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


exports.search = async (req, res) => {
    try {
        const { make, model, category, minPrice, maxPrice } = req.query;
        const vehicles = await searchVehiclesService({
            make,
            model,
            category,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined
        });
        return res.status(200).json(vehicles);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.update = async (req, res) => {
    try {
        const updated = await updateVehicleService(req.params.id, req.body);
        return res.status(200).json(updated);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await deleteVehicleService(req.params.id);
        return res.status(200).json({ message: 'Vehicle deleted successfully', vehicle: deleted });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.purchase = async (req, res) => {
    try {
        const vehicle = await purchaseVehicleService(req.params.id);
        return res.status(200).json({ message: 'Vehicle purchased successfully', vehicle });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.restock = async (req, res) => {
    try {
        const { quantity } = req.body;
        const vehicle = await restockVehicleService(req.params.id, quantity);
        return res.status(200).json({ message: 'Vehicle restocked successfully', vehicle });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
