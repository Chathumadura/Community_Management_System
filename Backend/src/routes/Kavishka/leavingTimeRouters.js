const express = require('express');
const router = express.Router();


const {
    assignParkingSlot,
    getAllParkingSlots,
    getLatestParkingSlot,
    updateSpecificTime,
    deleteParkingSlot
} = require('../../controller/Kavishka/leavingTimeController');

// Create
router.post('/assign', assignParkingSlot);

// Read
router.get('/all', getAllParkingSlots);
router.get('/:id', getLatestParkingSlot);

// Update
// Add this to your leavingTimeRoutes.js
router.patch('/update-time/:id', updateSpecificTime);

// Delete
router.delete('/delete/:id', deleteParkingSlot);

module.exports = router;