const express = require("express");
const router = express.Router();
const Attendance = require("../../model/Rasindu/Attendance");
const Employee = require("../../model/Rasindu/Employee");

// Working hours calculator
const calculateWorkingHours = async (employeeId, year, month) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  const records = await Attendance.find({
    employeeId,
    date: { $gte: start, $lte: end },
  });

  let total = 0;
  records.forEach(record => {
    if (record.checkIn && record.checkOut) {
      const hours = (new Date(record.checkOut) - new Date(record.checkIn)) / (1000 * 60 * 60);
      total += hours;
    }
  });

  return total;
};

// Mark Attendance API
router.post("/mark", async (req, res) => {
  try {
    const { empId } = req.body;

    if (!empId) {
      return res.status(400).json({ message: "EMP ID is required." });
    }

    // Validate empId format
    if (typeof empId !== 'string' || empId.trim() === '') {
      return res.status(400).json({ message: "Invalid EMP ID format." });
    }

    const employee = await Employee.findOne({ employeeId: empId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    
    let attendance = await Attendance.findOne({
      employeeId: empId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    const currentTime = new Date();

    if (!attendance) {
      // Mark check-in
      attendance = new Attendance({
        employeeId: empId,
        date: currentTime,
        checkIn: currentTime,
      });
      await attendance.save();
      return res.status(200).json({ message: "Check-in marked successfully." });
    } else if (!attendance.checkOut) {
      // Mark check-out
      const checkInTime = new Date(attendance.checkIn);
      const timeDiff = (currentTime - checkInTime) / 1000  // in seconds
      
      if (timeDiff < 15) {
        return res.status(400).json({ message: "Cannot check-out within 15 seconds of check-in." });
      }

      attendance.checkOut = currentTime;
      attendance.hoursWorked = (timeDiff / 3600).toFixed(2); // convert to hours
      
      await attendance.save();
      return res.status(200).json({ message: "Check-out marked successfully." });
    } else {
      return res.status(400).json({ message: "Already checked out for today." });
    }
  } catch (err) {
    console.error("Error in /attendance/mark:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get employee salary
router.get("/employee/:employeeId/:year/:month", async (req, res) => {
  const { employeeId, year, month } = req.params;

  try {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const totalHours = await calculateWorkingHours(employeeId, year, month);
    const monthlySalary = totalHours * employee.hourlyRate;

    res.json({
      employeeId: employee.employeeId,
      name: employee.name,
      role: employee.role,
      totalHours: parseFloat(totalHours.toFixed(2)),
      hourlyRate: employee.hourlyRate,
      monthlySalary: parseFloat(monthlySalary.toFixed(2)),
    });
  } catch (err) {
    console.error("Salary calc error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Monthly salary report
router.get("/monthlysal/:year/:month", async (req, res) => {
  const { year, month } = req.params;

  try {
    const employees = await Employee.find();
    const report = await Promise.all(employees.map(async emp => {
      const hours = await calculateWorkingHours(emp.employeeId, year, month);
      return {
        employeeId: emp.employeeId,
        name: emp.name,
        role: emp.role,
        totalHours: parseFloat(hours.toFixed(2)),
        hourlyRate: emp.hourlyRate,
        monthlySalary: parseFloat((hours * emp.hourlyRate).toFixed(2))
      };
    }));

    res.json(report);
  } catch (err) {
    console.error("Monthly salary error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;