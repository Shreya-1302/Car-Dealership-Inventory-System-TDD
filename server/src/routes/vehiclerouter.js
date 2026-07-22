
const express = require('express');
const router = express.Router();
const controller = require('../controllers/vehiclecontroller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


router.post('/', authMiddleware, controller.addVehicle);
router.get('/', authMiddleware, controller.getAll);
router.get('/search', authMiddleware, controller.search);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, adminMiddleware, controller.remove);
router.post('/:id/purchase', authMiddleware, controller.purchase);
router.post('/:id/restock', authMiddleware, adminMiddleware, controller.restock);

module.exports = router;
