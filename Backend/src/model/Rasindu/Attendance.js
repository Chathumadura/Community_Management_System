const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: { 
    type: String, 
    required: true 
  },
  checkIn: { 
    type: Date 
  },
  checkOut: { 
    type: Date 
  },
  date: { 
    type: Date, 
    required: true 
  },
  hoursWorked: {
    type: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);