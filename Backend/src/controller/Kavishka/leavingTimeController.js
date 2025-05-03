const Parking = require('../../model/Kavishka/leavingModel');

// Create
exports.assignParkingSlot = async (req, res) => {
    try {
        const { departureTimes, availableDays } = req.body;

        if (!availableDays.length || !departureTimes) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newParking = new Parking({ departureTimes, availableDays });
        await newParking.save();
        res.status(201).json({ message: "Parking slot assigned successfully!", data: newParking });
    } catch (error) {
        res.status(500).json({ message: "Error assigning parking slot", error });
    }
};

// Read All
exports.getAllParkingSlots = async (req, res) => {
    try {
        const all = await Parking.find();
        res.json(all);
    } catch (err) {
        res.status(500).json({ message: "Error fetching parking slots", error: err });
    }
};

// Read One (Latest)
exports.getLatestParkingSlot = async (req, res) => {
    try {
        const latest = await Parking.findOne().sort({ _id: -1 });
        if (!latest) return res.status(404).json({ message: "No data found" });

        res.json(latest);
    } catch (err) {
        res.status(500).json({ message: "Error fetching latest parking slot", error: err });
    }
};

// Update
// Add this to your leavingTimeController.js

// Update specific time
exports.updateSpecificTime = async (req, res) => {
    try {
        const { id } = req.params;
        const { day, newTime } = req.body;

        const parkingSlot = await Parking.findById(id);
        if (!parkingSlot) {
            return res.status(404).json({ message: "Parking slot not found" });
        }

        // Update the specific day's time
        parkingSlot.departureTimes[day] = newTime;
        
        await parkingSlot.save();
        res.json({ 
            message: "Time updated successfully",
            updatedSlot: parkingSlot
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Error updating time", 
            error: err.message 
        });
    }
};

// Delete
exports.deleteParkingSlot = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Parking.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Parking slot not found" });

        res.json({ message: "Parking slot deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting parking slot", error: err });
    }
};